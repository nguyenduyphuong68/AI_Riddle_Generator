/* ==========================================================================
   AI Riddle Generator - Main Controller Application Script
   ========================================================================== */

import { initialFeaturedRiddles, generateMockRiddle } from './database.js';
import * as awsData from './aws-guide.js';

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // State Management
    // ----------------------------------------------------------------------
    let myLibrary = JSON.parse(localStorage.getItem('my_riddle_library')) || [];
    let featuredRiddles = [...initialFeaturedRiddles];
    let currentGeneratedRiddle = null;
    let activeAwsTab = 'arch'; // arch | lambda | api | ddb

    // ----------------------------------------------------------------------
    // DOM Elements Cache
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');
    
    // Generator View Inputs
    const keywordInput = document.getElementById('keyword-input');
    const agePrimary = document.getElementById('age-primary');
    const genreSelects = document.getElementsByName('genre-option');
    const langVi = document.getElementById('lang-vi');
    const btnGenerate = document.getElementById('btn-generate');
    
    // Generator View Outputs
    const aiLoader = document.getElementById('ai-loader');
    const welcomePanel = document.getElementById('welcome-panel');
    const outputCard = document.getElementById('output-card');
    const riddleDisplayWrapper = document.getElementById('riddle-display-wrapper');
    const riddleTextContainer = document.getElementById('riddle-text-container');
    const riddleMetadataText = document.getElementById('riddle-metadata-text');
    
    // Hints & Answer elements
    const hint1Content = document.getElementById('hint1-content');
    const hint2Content = document.getElementById('hint2-content');
    const answerContent = document.getElementById('answer-content');
    const btnSaveLibrary = document.getElementById('btn-save-library');
    const btnPrintRiddle = document.getElementById('btn-print-riddle');
    
    // Featured / Library Containers
    const featuredGrid = document.getElementById('featured-grid');
    const libraryGrid = document.getElementById('library-grid');
    const libraryEmptyState = document.getElementById('library-empty-state');
    
    // AWS Developer Hub
    const awsSidebar = document.getElementById('aws-sidebar');
    const awsContentBody = document.getElementById('aws-content-body');

    // ----------------------------------------------------------------------
    // Theme Management
    // ----------------------------------------------------------------------
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // ----------------------------------------------------------------------
    // Client-side Navigation (Tab Switching)
    // ----------------------------------------------------------------------
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetViewId = link.getAttribute('data-tab');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${targetViewId}-view`) {
                    view.classList.add('active');
                }
            });

            // Specific View Triggers
            if (targetViewId === 'featured') {
                renderFeaturedRiddles();
            } else if (targetViewId === 'library') {
                renderLibraryRiddles();
            } else if (targetViewId === 'aws') {
                renderAwsDashboard();
            }
        });
    });

    // ----------------------------------------------------------------------
    // Riddle Generation Flow (Mock AI Endpoint)
    // ----------------------------------------------------------------------
    btnGenerate.addEventListener('click', () => {
        const keyword = keywordInput.value.trim();
        if (!keyword) {
            alert('Vui lòng nhập từ khóa đáp án!');
            keywordInput.focus();
            return;
        }

        if (keyword.length > 30) {
            alert('Từ khóa tối đa 30 ký tự để có câu đố hay nhất!');
            return;
        }

        // Gather options
        const grade = agePrimary.checked ? 'primary' : 'secondary';
        const lang = langVi.checked ? 'vi' : 'en';
        
        let selectedGenre = 'history-lit';
        genreSelects.forEach(radio => {
            if (radio.checked) {
                selectedGenre = radio.value;
            }
        });

        // Toggle UI loading states
        welcomePanel.style.display = 'none';
        riddleDisplayWrapper.style.display = 'none';
        aiLoader.style.display = 'flex';
        btnGenerate.disabled = true;

        // Simulate AI Bedrock latency (1.8 seconds)
        setTimeout(() => {
            currentGeneratedRiddle = generateMockRiddle(keyword, grade, selectedGenre, lang);
            
            // Fill UI with AI generated Riddle
            riddleMetadataText.innerHTML = `🏷️ ${translateGenre(selectedGenre)} &nbsp;•&nbsp; 🎓 ${grade === 'primary' ? 'Cấp 1' : 'Cấp 2'} &nbsp;•&nbsp; 🌐 ${lang.toUpperCase()}`;
            
            riddleTextContainer.innerHTML = currentGeneratedRiddle.text;
            if (currentGeneratedRiddle.isAcrostic) {
                riddleTextContainer.className = 'riddle-text acrostic';
            } else {
                riddleTextContainer.className = 'riddle-text';
            }
            
            hint1Content.textContent = currentGeneratedRiddle.hint1;
            hint2Content.textContent = currentGeneratedRiddle.hint2;
            
            // Format answer display
            answerContent.innerHTML = `
                <p>Từ khóa/Đáp án gốc:</p>
                <div class="answer-badge">${currentGeneratedRiddle.answer}</div>
            `;
            
            // Reset Collapsibles
            document.querySelectorAll('.reveal-item').forEach(item => {
                item.classList.remove('open');
                const content = item.querySelector('.reveal-content');
                content.style.maxHeight = null;
            });

            // Adjust library save button state
            const isAlreadySaved = myLibrary.some(item => item.text === currentGeneratedRiddle.text);
            updateLibrarySaveButton(isAlreadySaved);

            // Toggle UI showing output
            aiLoader.style.display = 'none';
            riddleDisplayWrapper.style.display = 'flex';
            btnGenerate.disabled = false;
        }, 1800);
    });

    // Handle Reveal Collapsibles
    document.querySelectorAll('.reveal-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.reveal-content');
            
            if (item.classList.contains('open')) {
                item.classList.remove('open');
                content.style.maxHeight = null;
            } else {
                item.classList.add('open');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ----------------------------------------------------------------------
    // Personal Library Bookmarks (LocalStorage Sync)
    // ----------------------------------------------------------------------
    btnSaveLibrary.addEventListener('click', () => {
        if (!currentGeneratedRiddle) return;

        const index = myLibrary.findIndex(item => item.text === currentGeneratedRiddle.text);
        if (index > -1) {
            // Remove from library
            myLibrary.splice(index, 1);
            updateLibrarySaveButton(false);
        } else {
            // Add to library
            const customRiddle = {
                id: 'saved-' + Date.now(),
                ...currentGeneratedRiddle,
                creator: 'Bạn đã lưu (AI Generated)',
                upvotes: 0
            };
            myLibrary.push(customRiddle);
            updateLibrarySaveButton(true);
        }
        localStorage.setItem('my_riddle_library', JSON.stringify(myLibrary));
    });

    function updateLibrarySaveButton(isSaved) {
        if (isSaved) {
            btnSaveLibrary.innerHTML = `<span>⭐</span> Đã Lưu thư viện`;
            btnSaveLibrary.classList.add('btn-save-active');
        } else {
            btnSaveLibrary.innerHTML = `<span>☆</span> Lưu Thư Viện`;
            btnSaveLibrary.classList.remove('btn-save-active');
        }
    }

    // Trigger Print View (Clean PDF Export)
    btnPrintRiddle.addEventListener('click', () => {
        window.print();
    });

    // ----------------------------------------------------------------------
    // Featured Riddles Showcase & Guesser Engine
    // ----------------------------------------------------------------------
    function renderFeaturedRiddles() {
        featuredGrid.innerHTML = '';
        featuredRiddles.forEach(item => {
            const card = document.createElement('div');
            card.className = 'glass-panel riddle-card';
            
            const isSaved = myLibrary.some(lib => lib.text === item.text);
            const isAcrostic = item.genre === 'acrostic';
            
            card.innerHTML = `
                <div class="card-header">
                    <div class="tag-list">
                        <span class="badge tag-primary">${translateGenre(item.genre)}</span>
                        <span class="badge tag-accent">${item.grade === 'primary' ? 'Cấp 1' : 'Cấp 2'}</span>
                    </div>
                    <button class="upvote-badge" data-id="${item.id}">
                        👍 <span>${item.upvotes}</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="card-riddle-preview ${isAcrostic ? 'acrostic' : ''}">${item.text}</div>
                    <div class="interactive-reveals">
                        <div class="reveal-item">
                            <button class="reveal-trigger">Gợi ý 1 (Khái quát)</button>
                            <div class="reveal-content">${item.hint1}</div>
                        </div>
                        <div class="reveal-item">
                            <button class="reveal-trigger">Gợi ý 2 (Chi tiết)</button>
                            <div class="reveal-content">${item.hint2}</div>
                        </div>
                    </div>
                    
                    <div class="guesser-input-wrapper">
                        <input type="text" class="form-input guess-input" placeholder="Nhập đáp án đoán thử...">
                        <button class="btn-guess">Đoán</button>
                    </div>
                    <div class="guess-feedback"></div>
                </div>
                <div class="card-actions-row">
                    <button class="btn-action btn-save-lib" data-id="${item.id}">
                        ${isSaved ? '⭐ Đã Lưu' : '☆ Lưu Thư Viện'}
                    </button>
                </div>
            `;
            
            // Upvote logic
            const upvoteBtn = card.querySelector('.upvote-badge');
            upvoteBtn.addEventListener('click', () => {
                if (upvoteBtn.classList.contains('liked')) {
                    upvoteBtn.classList.remove('liked');
                    item.upvotes--;
                } else {
                    upvoteBtn.classList.add('liked');
                    item.upvotes++;
                }
                upvoteBtn.querySelector('span').textContent = item.upvotes;
            });

            // Guess logic
            const guessInput = card.querySelector('.guess-input');
            const btnGuess = card.querySelector('.btn-guess');
            const feedback = card.querySelector('.guess-feedback');
            
            btnGuess.addEventListener('click', () => {
                const userGuess = guessInput.value.trim().toLowerCase();
                const actualAnswer = item.answer.trim().toLowerCase();
                if (!userGuess) return;
                
                if (userGuess === actualAnswer || actualAnswer.includes(userGuess) && userGuess.length > 2) {
                    feedback.className = 'guess-feedback correct';
                    feedback.textContent = '🎉 Chính xác! Đáp án đúng là: ' + item.answer;
                } else {
                    feedback.className = 'guess-feedback incorrect';
                    feedback.textContent = '❌ Chưa đúng rồi, thử lại nhé!';
                }
            });

            // Library save logic
            const libBtn = card.querySelector('.btn-save-lib');
            libBtn.addEventListener('click', () => {
                const idx = myLibrary.findIndex(lib => lib.text === item.text);
                if (idx > -1) {
                    myLibrary.splice(idx, 1);
                    libBtn.innerHTML = '☆ Lưu Thư Viện';
                } else {
                    myLibrary.push(item);
                    libBtn.innerHTML = '⭐ Đã Lưu';
                }
                localStorage.setItem('my_riddle_library', JSON.stringify(myLibrary));
            });

            // Bind newly rendered collapsibles inside cards
            card.querySelectorAll('.reveal-trigger').forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const revItem = trigger.parentElement;
                    const content = revItem.querySelector('.reveal-content');
                    if (revItem.classList.contains('open')) {
                        revItem.classList.remove('open');
                        content.style.maxHeight = null;
                    } else {
                        revItem.classList.add('open');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            });

            featuredGrid.appendChild(card);
        });
    }

    // ----------------------------------------------------------------------
    // My Library View Manager
    // ----------------------------------------------------------------------
    function renderLibraryRiddles() {
        libraryGrid.innerHTML = '';
        if (myLibrary.length === 0) {
            libraryEmptyState.style.display = 'flex';
            return;
        }
        libraryEmptyState.style.display = 'none';

        myLibrary.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'glass-panel riddle-card';
            const isAcrostic = item.genre === 'acrostic';
            
            card.innerHTML = `
                <div class="card-header">
                    <div class="tag-list">
                        <span class="badge tag-primary">${translateGenre(item.genre)}</span>
                        <span class="badge tag-accent">${item.grade === 'primary' ? 'Cấp 1' : 'Cấp 2'}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-riddle-preview ${isAcrostic ? 'acrostic' : ''}">${item.text}</div>
                    <div class="interactive-reveals">
                        <div class="reveal-item">
                            <button class="reveal-trigger">Gợi ý 1</button>
                            <div class="reveal-content">${item.hint1}</div>
                        </div>
                        <div class="reveal-item">
                            <button class="reveal-trigger">Gợi ý 2</button>
                            <div class="reveal-content">${item.hint2}</div>
                        </div>
                        <div class="reveal-item answer-item">
                            <button class="reveal-trigger">ĐÁP ÁN CUỐI CÙNG</button>
                            <div class="reveal-content">
                                <div class="answer-badge">${item.answer}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-actions-row">
                    <button class="btn-action btn-print-single">🖨️ In / PDF</button>
                    <button class="btn-action btn-delete-lib" style="border-color: var(--danger); color: var(--danger)">
                        🗑️ Xóa
                    </button>
                </div>
            `;
            
            // Delete callback
            card.querySelector('.btn-delete-lib').addEventListener('click', () => {
                myLibrary.splice(index, 1);
                localStorage.setItem('my_riddle_library', JSON.stringify(myLibrary));
                renderLibraryRiddles();
            });

            // Single Print callback
            card.querySelector('.btn-print-single').addEventListener('click', () => {
                // To print a single riddle, temporarily mock standard view
                const origWrapper = riddleDisplayWrapper.innerHTML;
                riddleMetadataText.innerHTML = `🏷️ ${translateGenre(item.genre)} &nbsp;•&nbsp; 🎓 ${item.grade === 'primary' ? 'Cấp 1' : 'Cấp 2'}`;
                riddleTextContainer.innerHTML = item.text;
                riddleTextContainer.className = isAcrostic ? 'riddle-text acrostic' : 'riddle-text';
                hint1Content.textContent = item.hint1;
                hint2Content.textContent = item.hint2;
                answerContent.innerHTML = `<div class="answer-badge">${item.answer}</div>`;
                
                window.print();
                
                // Restore previous generated states
                if (currentGeneratedRiddle) {
                    riddleMetadataText.innerHTML = `🏷️ ${translateGenre(currentGeneratedRiddle.genre)} &nbsp;•&nbsp; 🎓 ${currentGeneratedRiddle.grade === 'primary' ? 'Cấp 1' : 'Cấp 2'}`;
                    riddleTextContainer.innerHTML = currentGeneratedRiddle.text;
                    riddleTextContainer.className = currentGeneratedRiddle.isAcrostic ? 'riddle-text acrostic' : 'riddle-text';
                    hint1Content.textContent = currentGeneratedRiddle.hint1;
                    hint2Content.textContent = currentGeneratedRiddle.hint2;
                    answerContent.innerHTML = `<div class="answer-badge">${currentGeneratedRiddle.answer}</div>`;
                }
            });

            // Collapsibles inside library
            card.querySelectorAll('.reveal-trigger').forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const revItem = trigger.parentElement;
                    const content = revItem.querySelector('.reveal-content');
                    if (revItem.classList.contains('open')) {
                        revItem.classList.remove('open');
                        content.style.maxHeight = null;
                    } else {
                        revItem.classList.add('open');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            });

            libraryGrid.appendChild(card);
        });
    }

    // ----------------------------------------------------------------------
    // AWS Developer Hub Console Rendering
    // ----------------------------------------------------------------------
    function renderAwsDashboard() {
        awsSidebar.innerHTML = '';
        
        // Define internal AWS tabs
        const tabs = [
            { id: 'arch', label: '☁️ Sơ đồ Kiến trúc', title: 'Kiến trúc Tích hợp Hệ thống trên AWS' },
            { id: 'lambda', label: '⚙️ AWS Lambda (Python)', title: 'Hàm xử lý Lambda (Inference & DynamoDB SDK)' },
            { id: 'api', label: '🔌 Cấu hình API Gateway', title: 'Cơ chế tích hợp RESTful Endpoint và CORS' },
            { id: 'steps', label: '📚 Hướng dẫn Setup', title: 'Các bước triển khai chi tiết trên AWS Console' }
        ];

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `aws-tab-btn ${activeAwsTab === tab.id ? 'active' : ''}`;
            btn.innerHTML = tab.label;
            
            btn.addEventListener('click', () => {
                activeAwsTab = tab.id;
                renderAwsDashboard();
            });
            
            awsSidebar.appendChild(btn);
        });

        // Render selected tab content
        const activeTabObj = tabs.find(t => t.id === activeAwsTab);
        
        let dynamicContentHTML = `
            <div class="aws-header-badge">AWS SERVICE INTEGRATION ROADMAP</div>
            <h3 class="aws-title">${activeTabObj.title}</h3>
        `;

        if (activeAwsTab === 'arch') {
            dynamicContentHTML += `
                <p class="aws-description">
                    Mô hình hệ thống sử dụng kiến trúc không máy chủ (Serverless) tối ưu chi phí. Người dùng truy cập Giao diện Tĩnh lưu trên S3 thông qua CloudFront CDN. Khi thực hiện yêu cầu tạo câu đố, Client gửi HTTP POST tới API Gateway để kích hoạt Lambda. Lambda sẽ truy vấn Amazon Bedrock để gọi Mô hình ngôn ngữ lớn (Claude/Llama) tạo câu hỏi, sau đó lưu kết quả vào DynamoDB trước khi trả về trình duyệt.
                </p>
                <div class="arch-map">${awsData.awsArchitectureDiagram}</div>
            `;
        } else if (activeAwsTab === 'lambda') {
            dynamicContentHTML += `
                <p class="aws-description">
                    Đoạn code Python dưới đây chạy trong môi trường AWS Lambda. Code sẽ tiếp nhận tham số từ client, sinh các chỉ thị nghiệp vụ (system prompts) phù hợp với độ tuổi và thể loại câu đố để gửi lên mô hình Anthropic Claude qua AWS Bedrock Runtime SDK. Kết quả sau đó được ghi lại tự động vào DynamoDB.
                </p>
                <div class="code-container">
                    <div class="code-header">
                        <span class="code-lang">lambda_function.py</span>
                        <button class="btn-copy-code" id="btn-copy-lambda">Copy Code</button>
                    </div>
                    <pre><code>${escapeHtml(awsData.lambdaPythonCode)}</code></pre>
                </div>
            `;
        } else if (activeAwsTab === 'api') {
            dynamicContentHTML += `
                <p class="aws-description">
                    Để frontend Javascript kết nối với Lambda, bạn cần tạo cổng kết nối RESTful API. Dưới đây là đoạn code mẫu tích hợp trên Client-side và hướng dẫn cấu hình CORS trên API Gateway.
                </p>
                <div class="info-banner">
                    <p>⚠️ <strong>Lưu ý về CORS:</strong> Khi gọi API Gateway từ trình duyệt client (localhost hoặc s3 domain), trình duyệt sẽ block request nếu API Gateway chưa kích hoạt CORS OPTIONS. Hãy chắc chắn đã bật 'Enable CORS' trong menu Actions của Gateway Resource và Deploy API.</p>
                </div>
                <div class="code-container">
                    <div class="code-header">
                        <span class="code-lang">aws-fetch.js</span>
                        <button class="btn-copy-code" id="btn-copy-api">Copy Code</button>
                    </div>
                    <pre><code>${escapeHtml(awsData.frontendIntegrationSnippet)}</code></pre>
                </div>
            `;
        } else if (activeAwsTab === 'steps') {
            dynamicContentHTML += `
                <p class="aws-description">
                    Lộ trình 5 bước đơn giản giúp bạn tự cấu hình và triển khai dự án lên tài khoản AWS cá nhân:
                </p>
                <ul class="aws-steps-list">
            `;
            
            awsData.awsStepsList.forEach(step => {
                dynamicContentHTML += `
                    <li>
                        <strong>${step.title}:</strong>
                        <p style="margin-top: 0.25rem; color: var(--text-muted); font-size: 0.9rem">${step.details}</p>
                    </li>
                `;
            });

            dynamicContentHTML += `
                </ul>
                <div class="info-banner" style="margin-top: 2rem;">
                    <p>💡 <strong>Tài liệu kỹ thuật từ AWS:</strong></p>
                    <ul style="padding-left: 1.25rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem">
            `;

            awsData.awsLinks.forEach(link => {
                dynamicContentHTML += `
                    <li><a href="${link.url}" target="_blank">${link.label} ↗</a></li>
                `;
            });

            dynamicContentHTML += `
                    </ul>
                </div>
            `;
        }

        awsContentBody.innerHTML = dynamicContentHTML;

        // Bind Copy Code Buttons
        if (activeAwsTab === 'lambda') {
            document.getElementById('btn-copy-lambda').addEventListener('click', () => {
                copyToClipboard(awsData.lambdaPythonCode, 'btn-copy-lambda');
            });
        } else if (activeAwsTab === 'api') {
            document.getElementById('btn-copy-api').addEventListener('click', () => {
                copyToClipboard(awsData.frontendIntegrationSnippet, 'btn-copy-api');
            });
        }
    }

    // ----------------------------------------------------------------------
    // Helper Functions
    // ----------------------------------------------------------------------
    function translateGenre(genre) {
        switch (genre) {
            case 'history-lit': return '📜 Lịch sử - Văn học';
            case 'acrostic': return '🔠 Mật mã chữ đầu';
            case 'modern-meme': return '⚡ Meme - Trẻ trung';
            case 'music-art': return '🎨 Nghệ thuật - Nhạc';
            case 'science-math': return '📐 Khoa học - Toán';
            default: return '🧩 Câu đố vui';
        }
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function copyToClipboard(text, btnId) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById(btnId);
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.backgroundColor = 'var(--success)';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Không thể copy code: ', err);
        });
    }
});

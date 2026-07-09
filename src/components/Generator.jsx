import React, { useState } from 'react';
import { generateMockRiddleText } from '../data/db';
import { APIService } from '../data/api';

export default function Generator({ currentUserId, onSaveRiddle, isLoggedIn, onRequireLogin }) {
    const [keyword, setKeyword] = useState('');
    const [ageGroup, setAgeGroup] = useState('Cấp 1');
    const [genre, setGenre] = useState('Acrostic');
    const [topic, setTopic] = useState('Địa lý');
    const [lang, setLang] = useState('vi');
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [welcome, setWelcome] = useState(true);
    const [riddle, setRiddle] = useState(null);
    const [saved, setSaved] = useState(false);
    
    // Collapsible Reveals State
    const [reveals, setReveals] = useState({
        hint1: false,
        hint2: false,
        answer: false
    });

    const handleGenerate = async (e) => {
        e.preventDefault();
        
        setWelcome(false);
        setLoading(true);
        setRiddle(null);
        setSaved(false);
        setReveals({ hint1: false, hint2: false, answer: false });

        const payload = {
            keyword: keyword,
            age_group: ageGroup,
            genre: genre,
            topic: topic,
            language: lang,
            user_id: currentUserId,
            creator_role: isLoggedIn ? 'User' : 'Guest'
        };

        try {
            if (APIService.isConfigured()) {
                console.log("Calling API Gateway: ", APIService.getApiUrl());
                const response = await APIService.generateRiddle(payload);
                setRiddle(response);
            } else {
                console.warn("API is not configured, running local mock.");
                setTimeout(() => {
                    const localRiddle = generateMockRiddleText(keyword, ageGroup, genre, lang, topic);
                    setRiddle(localRiddle);
                    setLoading(false);
                }, 1000);
                return;
            }
        } catch (err) {
            console.error("API call failed, falling back to local simulation:", err);
            setTimeout(() => {
                const localRiddle = generateMockRiddleText(keyword, ageGroup, genre, lang, topic);
                setRiddle(localRiddle);
                setLoading(false);
            }, 1000);
            return;
        }
        setLoading(false);
    };

    const toggleReveal = (key) => {
        setReveals(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        if (!riddle || saved) return;
        if (!isLoggedIn) {
            const accept = window.confirm("Bạn cần đăng nhập để lưu câu đố này vào thư viện cá nhân. Đăng nhập ngay?");
            if (accept) onRequireLogin();
            return;
        }
        onSaveRiddle(riddle);
        setSaved(true);
    };

    const handlePrintSingle = async (riddleItem) => {
        try {
            if (APIService.isConfigured()) {
                console.log("Triggering backend /riddles/export endpoint from generator...");
                const result = await APIService.exportRiddle(riddleItem);
                
                if (result instanceof Blob) {
                    const fileURL = URL.createObjectURL(result);
                    window.open(fileURL, '_blank');
                    return;
                } else if (result && typeof result === 'object' && result.download_url) {
                    window.open(result.download_url, '_blank');
                    return;
                } else if (result && typeof result === 'object' && result.rendered_html) {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(result.rendered_html);
                    printWindow.document.close();
                    return;
                }
            }
        } catch (err) {
            console.error("Export API failed, falling back to local layout rendering:", err);
        }

        // Fallback to local HTML generation for printing
        const printWindow = window.open('', '_blank');
        const riddleText = riddleItem.content?.raw_text || riddleItem.riddle_content || '';
        const htmlContent = riddleItem.content?.rendered_html || riddleText.replace(/\n/g, '<br/>');
        const genreLabel = translateGenre(riddleItem.metadata?.genre || riddleItem.genre);
        const ageLabel = riddleItem.metadata?.age_group || riddleItem.age_group;
        const hint1Text = riddleItem.content?.hints?.[0] || riddleItem.hints?.[0] || 'Không có gợi ý';
        const hint2Text = riddleItem.content?.hints?.[1] || riddleItem.hints?.[1] || hint1Text;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>AI Riddle - ${riddleItem.keyword}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Plus Jakarta Sans', sans-serif;
                            padding: 2cm;
                            background: white;
                            color: #1f2937;
                        }
                        .riddle-card {
                            border: 2px solid #7c3aed;
                            border-radius: 16px;
                            padding: 1.5cm;
                            max-width: 15cm;
                            margin: 0 auto;
                            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                        }
                        .header {
                            font-size: 9pt;
                            text-transform: uppercase;
                            color: #7c3aed;
                            font-weight: 700;
                            margin-bottom: 0.5cm;
                            border-bottom: 1px solid #7c3aed;
                            padding-bottom: 0.2cm;
                        }
                        .riddle-text {
                            font-family: 'Quicksand', sans-serif;
                            font-size: 16pt;
                            line-height: 1.8;
                            color: #4c1d95;
                            margin-bottom: 1cm;
                            text-align: center;
                        }
                        .hint-block {
                            border-top: 1px dashed #ccc;
                            margin-top: 0.5cm;
                            padding-top: 0.3cm;
                            font-size: 10.5pt;
                            color: #4b5563;
                            line-height: 1.5;
                        }
                        .answer-container {
                            margin-top: 1cm;
                            text-align: center;
                        }
                        .answer-badge {
                            display: inline-block;
                            border: 2px solid #fbbf24;
                            background-color: #fffbeb;
                            color: #d97706;
                            padding: 0.3cm 1cm;
                            font-size: 13pt;
                            font-weight: 800;
                            border-radius: 6px;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }
                    </style>
                </head>
                <body>
                    <div class="riddle-card">
                        <div class="header">AI Riddle Generator &nbsp;•&nbsp; ${genreLabel} &nbsp;•&nbsp; ${ageLabel}</div>
                        <div class="riddle-text">${htmlContent}</div>
                        <div class="hint-block"><strong>Gợi ý 1:</strong> ${hint1Text}</div>
                        <div class="hint-block"><strong>Gợi ý 2:</strong> ${hint2Text}</div>
                        <div class="answer-container">
                            <div style="font-size: 9pt; color: #9ca3af; margin-bottom: 4px;">ĐÁP ÁN:</div>
                            <div class="answer-badge">${riddleItem.keyword}</div>
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const translateGenre = (g) => {
        switch (g) {
            case 'History-Lit': return '📜 Thơ tự sự / Văn xuôi';
            case 'Acrostic': return '🔠 Mật mã chữ đầu (Acrostic)';
            case 'Modern-Meme': return '⚡ Câu đố dí dỏm / Meme';
            case 'Music-Art': return '🎨 Nghệ thuật & Âm nhạc';
            case 'Science-Math': return '📐 Đố vui logic / Hình ảnh';
            default: return '🧩 Câu đố';
        }
    };

    return (
        <section id="generator-view" className="view-section">
            <div className="generator-layout">
                
                {/* Form Input Card */}
                <div className="glass-panel">
                    <h2 className="panel-title"><span>⚙️</span> Cấu hình câu đố</h2>
                    
                    <form onSubmit={handleGenerate}>
                        {/* Keyword input */}
                        <div className="form-group">
                            <label htmlFor="keyword-input" className="form-label">Từ khóa / Đáp án gốc</label>
                            <input 
                                type="text" 
                                id="keyword-input" 
                                className="form-input" 
                                placeholder="Ví dụ: Bánh chưng, Hồ Gươm, Tự lập..." 
                                maxLength={30}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Topic selection dropdown */}
                        <div className="form-group">
                            <label htmlFor="topic-select" className="form-label">Chủ đề kiến thức (Topic)</label>
                            <select 
                                id="topic-select"
                                className="form-input"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                style={{ fontWeight: 600 }}
                            >
                                <option value="Địa lý">🗺️ Địa lý</option>
                                <option value="Lịch sử">📜 Lịch sử</option>
                                <option value="Văn học">📚 Văn học</option>
                                <option value="Toán học">📐 Toán học</option>
                                <option value="Khoa học">🧪 Khoa học</option>
                            </select>
                        </div>
                        
                        {/* Age group */}
                        <div className="form-group">
                            <label className="form-label">Nhóm tuổi mục tiêu</label>
                            <div className="options-pill-grid">
                                <label className="pill-option">
                                    <input 
                                        type="radio" 
                                        name="age-option" 
                                        checked={ageGroup === 'Cấp 1'}
                                        onChange={() => setAgeGroup('Cấp 1')}
                                    />
                                    <span className="pill-text">🎓 Cấp 1 (Tiểu học)</span>
                                </label>
                                <label className="pill-option">
                                    <input 
                                        type="radio" 
                                        name="age-option" 
                                        checked={ageGroup === 'Cấp 2'}
                                        onChange={() => setAgeGroup('Cấp 2')}
                                    />
                                    <span className="pill-text">🏫 Cấp 2 (THCS)</span>
                                </label>
                            </div>
                        </div>
                        
                        {/* Genre selection */}
                        <div className="form-group">
                            <label className="form-label">Hình thức thể hiện (Genre)</label>
                            <div className="category-grid">
                                {[
                                    { value: 'History-Lit', label: '📜 Thơ tự sự / Văn xuôi' },
                                    { value: 'Acrostic', label: '🔠 Mật mã chữ đầu (Acrostic)' },
                                    { value: 'Modern-Meme', label: '⚡ Câu đố dí dỏm / Meme' },
                                    { value: 'Music-Art', label: '🎨 Nghệ thuật & Âm nhạc' },
                                    { value: 'Science-Math', label: '📐 Đố vui logic / Hình ảnh' }
                                ].map((item) => (
                                    <label key={item.value} className="pill-option">
                                        <input 
                                            type="radio" 
                                            name="genre-option" 
                                            value={item.value}
                                            checked={genre === item.value}
                                            onChange={() => setGenre(item.value)}
                                        />
                                        <span className="pill-text">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        {/* Language */}
                        <div className="form-group">
                            <label className="form-label">Ngôn ngữ câu đố</label>
                            <div className="options-pill-grid">
                                <label className="pill-option">
                                    <input 
                                        type="radio" 
                                        name="lang-option" 
                                        checked={lang === 'vi'}
                                        onChange={() => setLang('vi')}
                                    />
                                    <span className="pill-text">🇻🇳 Tiếng Việt</span>
                                </label>
                                <label className="pill-option">
                                    <input 
                                        type="radio" 
                                        name="lang-option" 
                                        checked={lang === 'en'}
                                        onChange={() => setLang('en')}
                                    />
                                    <span className="pill-text">🇺🇸 English</span>
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" disabled={loading} className="btn-generate">
                            ⚡ Tạo Câu Đố Với AI
                        </button>
                    </form>
                </div>
                
                {/* Result Card */}
                <div className="glass-panel output-card">
                    {welcome && (
                        <div className="welcome-panel">
                            <div className="welcome-icon">🪄</div>
                            <h3>Sẵn sàng tạo câu đố!</h3>
                            <p>Chọn các thông tin dữ liệu cứng ở khung bên trái và bấm nút kích hoạt AI. Hệ thống sẽ ngay lập tức sinh câu đố tương ứng với các gợi ý tư duy.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="ai-loader">
                            <div className="ai-pulse-icon">🔮</div>
                            <h3>AI đang sáng tạo câu đố...</h3>
                            <p>Đang tải dữ liệu câu đố từ hệ thống cơ sở dữ liệu...</p>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill"></div>
                            </div>
                        </div>
                    )}

                    {riddle && (
                        <div className="riddle-display-wrapper">
                            <div className="riddle-metadata-row">
                                <div className="riddle-metadata-badge">
                                    🏷️ {translateGenre(riddle.metadata?.genre)} &nbsp;•&nbsp; 🎓 {riddle.metadata?.age_group} &nbsp;•&nbsp; 🌐 {riddle.metadata?.language?.toUpperCase()} &nbsp;•&nbsp; 📚 {riddle.metadata?.topic}
                                </div>
                            </div>
                            
                            <div className="riddle-content-block">
                                <div className="riddle-text">
                                    {riddle.content?.rendered_html ? (
                                        <div dangerouslySetInnerHTML={{ __html: riddle.content.rendered_html }} />
                                    ) : (
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{riddle.content?.raw_text}</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Collapsible Reveals */}
                            <div className="interactive-reveals">
                                <div className={`reveal-item ${reveals.hint1 ? 'open' : ''}`}>
                                    <button className="reveal-trigger" onClick={() => toggleReveal('hint1')} type="button">
                                        💡 Gợi ý bước 1 (Khái quát)
                                        <span className="reveal-trigger-arrow">▼</span>
                                    </button>
                                    <div className="reveal-content" style={{ maxHeight: reveals.hint1 ? '200px' : '0' }}>
                                        {riddle.content?.hints?.[0]}
                                    </div>
                                </div>
                                
                                <div className={`reveal-item ${reveals.hint2 ? 'open' : ''}`}>
                                    <button className="reveal-trigger" onClick={() => toggleReveal('hint2')} type="button">
                                        🔑 Gợi ý bước 2 (Chi tiết)
                                        <span className="reveal-trigger-arrow">▼</span>
                                    </button>
                                    <div className="reveal-content" style={{ maxHeight: reveals.hint2 ? '200px' : '0' }}>
                                        {riddle.content?.hints?.[1] || riddle.content?.hints?.[0]}
                                    </div>
                                </div>
                                
                                <div className={`reveal-item answer-item ${reveals.answer ? 'open' : ''}`}>
                                    <button className="reveal-trigger" onClick={() => toggleReveal('answer')} type="button">
                                        🏆 XEM ĐÁP ÁN CUỐI CÙNG
                                        <span className="reveal-trigger-arrow">▼</span>
                                    </button>
                                    <div className="reveal-content" style={{ maxHeight: reveals.answer ? '200px' : '0' }}>
                                        <div className="answer-badge-container">
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                Từ khóa gốc:
                                            </span>
                                            <div className="answer-badge">{riddle.keyword}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Generator Action Buttons */}
                            <div className="card-actions-row">
                                <button 
                                    onClick={handleSave} 
                                    className={`btn-action ${saved ? 'btn-save-active' : ''}`}
                                    disabled={saved}
                                    type="button"
                                >
                                    {saved ? (
                                        <><span>⭐</span> Đã Lưu Vào Thư Viện</>
                                    ) : (
                                        <><span>☆</span> Lưu Vào Thư Viện</>
                                    )}
                                </button>
                                <button 
                                    onClick={() => handlePrintSingle(riddle)} 
                                    className="btn-action"
                                    type="button"
                                >
                                    🖨️ Xuất PDF / In câu đố
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

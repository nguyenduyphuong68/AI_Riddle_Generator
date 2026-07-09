import React, { useState } from 'react';
import { APIService } from '../data/api';

export default function Library({ libraryRiddles, onDeleteRiddle }) {
    const [openReveals, setOpenReveals] = useState({});

    const toggleCardReveal = (riddleId, key) => {
        const compoundKey = `${riddleId}_${key}`;
        setOpenReveals(prev => ({
            ...prev,
            [compoundKey]: !prev[compoundKey]
        }));
    };

    const handlePrintSingle = async (riddle) => {
        try {
            if (APIService.isConfigured()) {
                console.log("Triggering backend /riddles/export endpoint...");
                const result = await APIService.exportRiddle(riddle);
                
                if (result instanceof Blob) {
                    const fileURL = URL.createObjectURL(result);
                    window.open(fileURL, '_blank');
                    return;
                } else if (result && typeof result === 'object' && result.export_url) {
                    window.open(result.export_url, '_blank');
                    return;
                } else if (result && typeof result === 'object' && result.rendered_html) {
                    // If the backend returns HTML code to display
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
        const riddleText = riddle.content?.raw_text || riddle.riddle_content || '';
        const htmlContent = riddle.content?.rendered_html || riddleText.replace(/\n/g, '<br/>');
        const genreLabel = translateGenre(riddle.metadata?.genre || riddle.genre);
        const ageLabel = riddle.metadata?.age_group || riddle.age_group;
        const hint1Text = riddle.content?.hints?.[0] || riddle.hints?.[0] || 'Không có gợi ý';
        const hint2Text = riddle.content?.hints?.[1] || riddle.hints?.[1] || hint1Text;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>AI Riddle - ${riddle.keyword}</title>
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
                            <div class="answer-badge">${riddle.keyword}</div>
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
        <section id="library-view" className="view-section">
            <div className="filter-bar">
                <h2>📚 Bộ sưu tập cá nhân của tôi</h2>
            </div>
            
            {libraryRiddles.length === 0 ? (
                <div className="library-empty-state">
                    <div className="library-empty-icon">📁</div>
                    <h3>Thư viện chưa có câu đố nào</h3>
                    <p>Hãy chuyển sang tab <strong>Tạo Câu Đố</strong>, tạo câu đố mới và lưu lại để xây dựng bộ sưu tập của bạn tại đây.</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {libraryRiddles.map((riddle) => {
                        const riddleContentText = riddle.content?.raw_text || riddle.riddle_content;
                        return (
                            <div key={riddle.riddle_id} className="glass-panel riddle-card">
                                <div className="card-header">
                                    <div className="tag-list">
                                        <span className="badge tag-primary">{translateGenre(riddle.metadata?.genre || riddle.genre)}</span>
                                        <span className="badge tag-accent">{riddle.metadata?.age_group || riddle.age_group}</span>
                                        {(riddle.metadata?.topic) && (
                                            <span className="badge tag-info" style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                                📚 {riddle.metadata.topic}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="card-riddle-preview">
                                        {riddle.content?.rendered_html ? (
                                            <div dangerouslySetInnerHTML={{ __html: riddle.content.rendered_html }} />
                                        ) : (
                                            <div style={{ whiteSpace: 'pre-wrap' }}>{riddleContentText}</div>
                                        )}
                                    </div>

                                    {/* Clues & Answer reveals */}
                                    <div className="interactive-reveals" style={{ marginTop: 'auto' }}>
                                        <div className={`reveal-item ${openReveals[`${riddle.riddle_id}_hint1`] ? 'open' : ''}`}>
                                            <button 
                                                className="reveal-trigger"
                                                onClick={() => toggleCardReveal(riddle.riddle_id, 'hint1')}
                                            >
                                                Gợi ý 1
                                                <span className="reveal-trigger-arrow">▼</span>
                                            </button>
                                            <div 
                                                className="reveal-content"
                                                style={{ maxHeight: openReveals[`${riddle.riddle_id}_hint1`] ? '120px' : '0' }}
                                            >
                                                {riddle.content?.hints?.[0] || riddle.hints?.[0]}
                                            </div>
                                        </div>

                                        <div className={`reveal-item ${openReveals[`${riddle.riddle_id}_hint2`] ? 'open' : ''}`}>
                                            <button 
                                                className="reveal-trigger"
                                                onClick={() => toggleCardReveal(riddle.riddle_id, 'hint2')}
                                            >
                                                Gợi ý 2
                                                <span className="reveal-trigger-arrow">▼</span>
                                            </button>
                                            <div 
                                                className="reveal-content"
                                                style={{ maxHeight: openReveals[`${riddle.riddle_id}_hint2`] ? '120px' : '0' }}
                                            >
                                                {riddle.content?.hints?.[1] || riddle.hints?.[1] || riddle.content?.hints?.[0] || riddle.hints?.[0]}
                                            </div>
                                        </div>

                                        <div className={`reveal-item answer-item ${openReveals[`${riddle.riddle_id}_answer`] ? 'open' : ''}`}>
                                            <button 
                                                className="reveal-trigger"
                                                onClick={() => toggleCardReveal(riddle.riddle_id, 'answer')}
                                            >
                                                ĐÁP ÁN ĐÚNG
                                                <span className="reveal-trigger-arrow">▼</span>
                                            </button>
                                            <div 
                                                className="reveal-content"
                                                style={{ maxHeight: openReveals[`${riddle.riddle_id}_answer`] ? '120px' : '0' }}
                                            >
                                                <div className="answer-badge-container">
                                                    <div className="answer-badge">{riddle.keyword}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions-row">
                                    <button 
                                        onClick={() => handlePrintSingle(riddle)}
                                        className="btn-action"
                                    >
                                        🖨️ In / Xuất PDF
                                    </button>
                                    <button 
                                        onClick={() => onDeleteRiddle(riddle.riddle_id)}
                                        className="btn-action"
                                        style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                    >
                                        🗑️ Xóa khỏi thư viện
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

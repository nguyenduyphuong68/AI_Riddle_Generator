import React, { useState } from 'react';
import { generateMockRiddleText } from '../data/db';

export default function Generator({ onSaveRiddle }) {
    const [keyword, setKeyword] = useState('');
    const [ageGroup, setAgeGroup] = useState('Cấp 1');
    const [genre, setGenre] = useState('Acrostic');
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

    const handleGenerate = (e) => {
        e.preventDefault();
        
        setWelcome(false);
        setLoading(true);
        setRiddle(null);
        setSaved(false);
        setReveals({ hint1: false, hint2: false, answer: false });

        // Simulate AI loading duration (1.2 seconds)
        setTimeout(() => {
            const rawRiddle = generateMockRiddleText(keyword, ageGroup, genre, lang);
            
            const structuredRiddle = {
                keyword: rawRiddle.keyword || keyword,
                age_group: ageGroup,
                genre: genre,
                riddle_content: rawRiddle.riddle_content,
                hints: rawRiddle.hints || ["Không có gợi ý"],
                lang: lang
            };

            setRiddle(structuredRiddle);
            setLoading(false);
        }, 1200);
    };

    const toggleReveal = (key) => {
        setReveals(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        if (!riddle || saved) return;
        onSaveRiddle(riddle);
        setSaved(true);
    };

    const translateGenre = (g) => {
        switch (g) {
            case 'History-Lit': return '📜 Lịch sử - Văn học';
            case 'Acrostic': return '🔠 Mật mã chữ đầu';
            case 'Modern-Meme': return '⚡ Meme - Trẻ trung';
            case 'Music-Art': return '🎨 Nghệ thuật - Nhạc';
            case 'Science-Math': return '📐 Khoa học - Toán';
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
                            <label className="form-label">Thể loại câu đố</label>
                            <div className="category-grid">
                                {[
                                    { value: 'History-Lit', label: '📜 Lịch sử - Văn học' },
                                    { value: 'Acrostic', label: '🔠 Mật mã chữ đầu' },
                                    { value: 'Modern-Meme', label: '⚡ Meme - Trẻ trung' },
                                    { value: 'Music-Art', label: '🎨 Nghệ thuật - Nhạc' },
                                    { value: 'Science-Math', label: '📐 Khoa học - Toán' }
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
                                    🏷️ {translateGenre(riddle.genre)} &nbsp;•&nbsp; 🎓 {riddle.age_group} &nbsp;•&nbsp; 🌐 {riddle.lang.toUpperCase()}
                                </div>
                            </div>
                            
                            <div className="riddle-content-block">
                                <div className="riddle-text">
                                    {riddle.riddle_content}
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
                                        {riddle.hints[0]}
                                    </div>
                                </div>
                                
                                <div className={`reveal-item ${reveals.hint2 ? 'open' : ''}`}>
                                    <button className="reveal-trigger" onClick={() => toggleReveal('hint2')} type="button">
                                        🔑 Gợi ý bước 2 (Chi tiết)
                                        <span className="reveal-trigger-arrow">▼</span>
                                    </button>
                                    <div className="reveal-content" style={{ maxHeight: reveals.hint2 ? '200px' : '0' }}>
                                        {riddle.hints[1] || riddle.hints[0]}
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
                                    onClick={() => window.print()} 
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

import React, { useState } from 'react';
import { DynamoDBClient } from '../data/db';

export default function Community({ riddles, onUpvoteRiddle, onSaveRiddle, savedRiddles, currentUserId }) {
    const [genreFilter, setGenreFilter] = useState('ALL');
    const [guesses, setGuesses] = useState({});
    const [feedbacks, setFeedbacks] = useState({});
    
    // Collapsible Reveals per card
    const [openReveals, setOpenReveals] = useState({});

    // Filtered riddles based on genre
    const featuredRiddles = riddles
        .filter(r => r.GSI1PK) // Must be featured
        .filter(r => {
            if (genreFilter === 'ALL') return true;
            return r.genre.toUpperCase() === genreFilter.toUpperCase();
        })
        .sort((a, b) => b.upvotes - a.upvotes); // Sorted by upvotes descending

    const handleGuess = (riddleId, actualAnswer) => {
        const userGuess = (guesses[riddleId] || '').trim().toLowerCase();
        const correctAns = actualAnswer.trim().toLowerCase();
        
        if (!userGuess) return;

        if (userGuess === correctAns || correctAns.includes(userGuess) && userGuess.length > 2) {
            setFeedbacks(prev => ({ 
                ...prev, 
                [riddleId]: { status: 'correct', msg: `🎉 Chính xác! Đáp án đúng là: ${actualAnswer}` } 
            }));
        } else {
            setFeedbacks(prev => ({ 
                ...prev, 
                [riddleId]: { status: 'incorrect', msg: '❌ Chưa đúng rồi, thử lại nhé!' } 
            }));
        }
    };

    const handleInputChange = (riddleId, value) => {
        setGuesses(prev => ({ ...prev, [riddleId]: value }));
    };

    const toggleCardReveal = (riddleId, key) => {
        const compoundKey = `${riddleId}_${key}`;
        setOpenReveals(prev => ({
            ...prev,
            [compoundKey]: !prev[compoundKey]
        }));
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
        <section id="featured-view" className="view-section">
            <div className="filter-bar">
                <h2>⭐ Kho câu đố nổi bật từ cộng đồng</h2>
                
                {/* Genre Filters */}
                <div className="gallery-filters">
                    {[
                        { id: 'ALL', label: 'Tất cả' },
                        { id: 'History-Lit', label: 'Lịch sử - Văn học' },
                        { id: 'Acrostic', label: 'Mật mã chữ đầu' },
                        { id: 'Modern-Meme', label: 'Meme - Trẻ trung' },
                        { id: 'Science-Math', label: 'Khoa học - Toán' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            className={`filter-btn ${genreFilter === tab.id ? 'active' : ''}`}
                            onClick={() => setGenreFilter(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {featuredRiddles.length === 0 ? (
                <div className="library-empty-state">
                    <div className="library-empty-icon">🔎</div>
                    <h3>Không tìm thấy câu đố nào</h3>
                    <p>Chưa có câu đố nào thuộc thể loại này trong cơ sở dữ liệu.</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {featuredRiddles.map(riddle => {
                        const isSaved = savedRiddles.some(sr => sr.riddle_content === riddle.riddle_content);
                        const feedback = feedbacks[riddle.riddle_id];
                        
                        // Check if this riddle is upvoted by the active user PK
                        const locallyLiked = DynamoDBClient.hasUserLiked(currentUserId, riddle.riddle_id);

                        return (
                            <div key={riddle.riddle_id} className="glass-panel riddle-card">
                                <div className="card-header">
                                    <div className="tag-list">
                                        <span className="badge tag-primary">{translateGenre(riddle.genre)}</span>
                                        <span className="badge tag-accent">{riddle.age_group}</span>
                                    </div>
                                    <button 
                                        onClick={() => onUpvoteRiddle(riddle.riddle_id)}
                                        className={`upvote-badge ${locallyLiked ? 'liked' : ''}`}
                                        title="Bấm để bình chọn câu đố hay"
                                    >
                                        👍 <span>{riddle.upvotes}</span>
                                    </button>
                                </div>

                                <div className="card-body">
                                    <div className="card-riddle-preview">
                                        {riddle.riddle_content}
                                    </div>

                                    {/* Clue Reveals */}
                                    <div className="interactive-reveals" style={{ marginTop: 'auto' }}>
                                        <div className={`reveal-item ${openReveals[`${riddle.riddle_id}_hint1`] ? 'open' : ''}`}>
                                            <button 
                                                className="reveal-trigger"
                                                onClick={() => toggleCardReveal(riddle.riddle_id, 'hint1')}
                                            >
                                                Gợi ý 1 (Khái quát)
                                                <span className="reveal-trigger-arrow">▼</span>
                                            </button>
                                            <div 
                                                className="reveal-content"
                                                style={{ maxHeight: openReveals[`${riddle.riddle_id}_hint1`] ? '120px' : '0' }}
                                            >
                                                {riddle.hints[0]}
                                            </div>
                                        </div>

                                        <div className={`reveal-item ${openReveals[`${riddle.riddle_id}_hint2`] ? 'open' : ''}`}>
                                            <button 
                                                className="reveal-trigger"
                                                onClick={() => toggleCardReveal(riddle.riddle_id, 'hint2')}
                                            >
                                                Gợi ý 2 (Chi tiết)
                                                <span className="reveal-trigger-arrow">▼</span>
                                            </button>
                                            <div 
                                                className="reveal-content"
                                                style={{ maxHeight: openReveals[`${riddle.riddle_id}_hint2`] ? '120px' : '0' }}
                                            >
                                                {riddle.hints[1] || riddle.hints[0]}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guess Input */}
                                    <div className="guesser-input-wrapper">
                                        <input 
                                            type="text" 
                                            className="form-input guess-input" 
                                            placeholder="Bé đoán thử đáp án xem..."
                                            value={guesses[riddle.riddle_id] || ''}
                                            onChange={(e) => handleInputChange(riddle.riddle_id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleGuess(riddle.riddle_id, riddle.keyword);
                                            }}
                                        />
                                        <button 
                                            onClick={() => handleGuess(riddle.riddle_id, riddle.keyword)}
                                            className="btn-guess"
                                        >
                                            Đoán
                                        </button>
                                    </div>
                                    
                                    {feedback && (
                                        <div className={`guess-feedback ${feedback.status}`}>
                                            {feedback.msg}
                                        </div>
                                    )}
                                </div>

                                <div className="card-actions-row">
                                    <button 
                                        onClick={() => onSaveRiddle(riddle)}
                                        className={`btn-action ${isSaved ? 'btn-save-active' : ''}`}
                                        disabled={isSaved}
                                    >
                                        {isSaved ? '⭐ Đã Lưu Thư Viện' : '☆ Lưu Thư Viện'}
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

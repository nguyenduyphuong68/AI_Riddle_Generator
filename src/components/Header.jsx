import React from 'react';

export default function Header({ 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    isLoggedIn,
    currentUser,
    onLogout,
    onLoginClick
}) {
    return (
        <header>
            <div className="nav-container">
                <div className="logo-section">
                    <span className="logo-icon">🧩</span>
                    <div className="logo-text">
                        <h1>AI Riddle Generator</h1>
                        <span>Hệ thống câu đố tư duy trẻ em</span>
                    </div>
                </div>
                
                <nav>
                    <ul className="nav-menu">
                        <li>
                            <button 
                                className={`nav-link ${activeTab === 'generator' ? 'active' : ''}`}
                                onClick={() => setActiveTab('generator')}
                            >
                                💡 Tạo Câu Đố
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`nav-link ${activeTab === 'featured' ? 'active' : ''}`}
                                onClick={() => setActiveTab('featured')}
                            >
                                ⭐ Cộng Đồng
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`nav-link ${activeTab === 'library' ? 'active' : ''}`}
                                onClick={() => setActiveTab('library')}
                            >
                                📚 Thư Viện Của Tôi
                            </button>
                        </li>
                    </ul>
                </nav>
                
                <div className="controls-group">
                    {isLoggedIn && currentUser ? (
                        <div className="user-selector-wrapper" style={{ 
                            padding: '0.4rem 0.8rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-surface-solid)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    👤 {currentUser.Name}
                                </span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)' }}>
                                    {currentUser.Role === 'Teacher' ? 'Giáo viên' : 'Phụ huynh'}
                                </span>
                            </div>
                            <button 
                                onClick={onLogout}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: 'var(--danger)', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer',
                                    borderLeft: '1px solid var(--border-color)',
                                    paddingLeft: '0.75rem',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={onLoginClick}
                            className="btn-action"
                            style={{ 
                                padding: '0.4rem 1rem', 
                                border: '1px solid var(--primary)', 
                                color: 'var(--primary)',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                            }}
                        >
                            Đăng nhập
                        </button>
                    )}

                    <button 
                        onClick={toggleTheme} 
                        className="theme-toggle-btn" 
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
        </header>
    );
}

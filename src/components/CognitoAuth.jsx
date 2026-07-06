import React, { useState } from 'react';
import { DynamoDBClient } from '../data/db';

export default function CognitoAuth({ onLogin, onRegister }) {
    const [tab, setTab] = useState('login'); // login | register
    
    // Form inputs state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Teacher'); // Teacher | Parent
    
    // Feedback alerts
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const demoProfiles = DynamoDBClient.getProfiles();

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ Email và Mật khẩu!');
            return;
        }

        // Find profile matching email (case-insensitive)
        const match = demoProfiles.find(p => p.Email.toLowerCase() === email.trim().toLowerCase());
        
        if (match) {
            setSuccess('Đăng nhập thành công!');
            setTimeout(() => {
                onLogin(match.PK.replace('USER#', ''));
            }, 800);
        } else {
            setError('Không tìm thấy tài khoản với email này trong hệ thống Cognito!');
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !email || !password) {
            setError('Vui lòng điền đầy đủ các thông tin đăng ký!');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu tối thiểu phải từ 6 ký tự!');
            return;
        }

        // Call database register
        const res = onRegister(name, email, role);
        if (res.success) {
            setSuccess('Đăng ký thành công! Đang thiết lập JWT Token...');
            setTimeout(() => {
                onLogin(res.user.PK.replace('USER#', ''));
            }, 1000);
        } else {
            setError(res.error || 'Có lỗi xảy ra trong quá trình đăng ký!');
        }
    };

    const handleQuickLogin = (userId) => {
        setError('');
        setSuccess('Đăng nhập nhanh thành công!');
        setTimeout(() => {
            onLogin(userId);
        }, 600);
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '550px', margin: '3rem auto', padding: '2.5rem' }}>
            {/* Cognito Branding Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem' }}>🔐</span>
                <h3 style={{ fontSize: '1.6rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    AWS Cognito Authentication
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Cổng xác thực người dùng cho dự án AI Riddle Generator
                </p>
            </div>

            {/* Tab Switches */}
            <div className="options-pill-grid" style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                    className="nav-link"
                    style={{ 
                        flex: 1, 
                        justifyContent: 'center', 
                        background: tab === 'login' ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' : 'var(--bg-surface-solid)',
                        color: tab === 'login' ? 'white' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        padding: '0.75rem'
                    }}
                >
                    🔑 Đăng nhập
                </button>
                <button 
                    onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
                    className="nav-link"
                    style={{ 
                        flex: 1, 
                        justifyContent: 'center', 
                        background: tab === 'register' ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' : 'var(--bg-surface-solid)',
                        color: tab === 'register' ? 'white' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        padding: '0.75rem'
                    }}
                >
                    👤 Đăng ký
                </button>
            </div>

            {/* Alert boxes */}
            {error && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700, borderLeft: '4px solid var(--danger)' }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700, borderLeft: '4px solid var(--success)' }}>
                    {success}
                </div>
            )}

            {/* Forms rendering */}
            {tab === 'login' ? (
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label">Địa chỉ Email</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            placeholder="nhap.email@school.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-generate" style={{ marginTop: '0.5rem' }}>
                        Đăng Nhập Ngay
                    </button>

                    {/* Quick Demo Login Option */}
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                            Hoặc thử nhanh bằng tài khoản mẫu có sẵn:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {demoProfiles.map(p => (
                                <button
                                    key={p.PK}
                                    type="button"
                                    onClick={() => handleQuickLogin(p.PK.replace('USER#', ''))}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.6rem 1rem',
                                        backgroundColor: 'var(--bg-app)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        color: 'var(--text-main)',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = ''}
                                >
                                    <span>👤 {p.Name} ({p.Role === 'Teacher' ? 'Giáo viên' : p.Role === 'Parent' ? 'Phụ huynh' : 'Học sinh'})</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Đăng nhập ➔</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label">Họ và Tên</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Nguyễn Văn A" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Địa chỉ Email đăng ký</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            placeholder="vietname@school.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="Mật khẩu tối thiểu 6 ký tự" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Vai trò sử dụng</label>
                        <div className="options-pill-grid">
                            <label className="pill-option">
                                <input 
                                    type="radio" 
                                    name="reg-role" 
                                    checked={role === 'Teacher'}
                                    onChange={() => setRole('Teacher')}
                                />
                                <span className="pill-text">🏫 Giáo viên (Teacher)</span>
                            </label>
                            <label className="pill-option">
                                <input 
                                    type="radio" 
                                    name="reg-role" 
                                    checked={role === 'Parent'}
                                    onChange={() => setRole('Parent')}
                                />
                                <span className="pill-text">🏡 Phụ huynh (Parent)</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn-generate" style={{ marginTop: '0.5rem' }}>
                        Tạo Tài Khoản & Đăng Nhập
                    </button>
                </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ℹ️ <em>Tính năng xác thực được giả lập dựa trên cơ chế JWT Token cấp phát từ dịch vụ AWS Cognito.</em>
            </div>
        </div>
    );
}

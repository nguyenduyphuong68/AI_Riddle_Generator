import React, { useState } from 'react';
import { DynamoDBClient } from '../data/db';
import { CognitoService } from '../data/auth';

export default function CognitoAuth({ onLogin, onRegister }) {
    const [tab, setTab] = useState('login'); // login | register | confirm
    
    // Form inputs state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Teacher'); // Teacher | Parent
    const [codeArray, setCodeArray] = useState(['', '', '', '', '', '']);
    const inputRefs = React.useRef([]);
    
    // Feedback alerts
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const demoProfiles = DynamoDBClient.getProfiles();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ Email và Mật khẩu!');
            return;
        }

        try {
            if (CognitoService.isConfigured()) {
                setSuccess('Đang xác thực với AWS Cognito...');
                const authData = await CognitoService.signIn(email, password);
                const idToken = authData.AuthenticationResult.IdToken;
                const user = CognitoService.decodeIdToken(idToken);
                
                if (user) {
                    // Dynamically register in LocalStorage DB to keep user session synced with frontend data
                    onRegister(user.name, user.email, user.role, user.userId); 
                    setSuccess(`Đăng nhập thành công! Chào mừng ${user.name}.`);
                    setTimeout(() => {
                        onLogin(user.userId);
                    }, 800);
                } else {
                    setError('Không thể giải mã dữ liệu token từ Cognito!');
                }
            } else {
                // Fallback to mock profiles
                const match = demoProfiles.find(p => p.Email.toLowerCase() === email.trim().toLowerCase());
                if (match) {
                    setSuccess('Đăng nhập thành công!');
                    setTimeout(() => {
                        onLogin(match.PK.replace('USER#', ''));
                    }, 800);
                } else {
                    setError('Không tìm thấy tài khoản mẫu với email này. Vui lòng bật tab Developer Hub để cấu hình AWS Cognito thật!');
                }
            }
        } catch (err) {
            let msg = err.message || 'Đăng nhập thất bại!';
            if (msg.includes('USER_PASSWORD_AUTH flow not enabled')) {
                msg = 'Lỗi cấu hình Cognito: Bạn cần kích hoạt dòng chảy "USER_PASSWORD_AUTH" trong App Client trên AWS Console (Xem hướng dẫn chi tiết ở dưới).';
            }
            setError(msg);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !email || !password) {
            setError('Vui lòng điền đầy đủ các thông tin đăng ký!');
            return;
        }

        const minLength = CognitoService.isConfigured() ? 8 : 6;
        if (password.length < minLength) {
            setError(`Mật khẩu tối thiểu phải từ ${minLength} ký tự!`);
            return;
        }

        try {
            if (CognitoService.isConfigured()) {
                setSuccess('Đang đăng ký tài khoản trên AWS Cognito...');
                await CognitoService.signUp(email, password, name, role);
                setSuccess('Đăng ký thành công! Một mã xác thực đã được gửi về email của bạn. Vui lòng điền mã để kích hoạt tài khoản.');
                // Switch to confirm tab but keep email to use in confirm request
                setTimeout(() => {
                    setTab('confirm');
                    setSuccess('');
                }, 1500);
            } else {
                // Fallback to mock register
                const res = onRegister(name, email, role);
                if (res.success) {
                    setSuccess('Đăng ký thành công! Đang thiết lập JWT Token...');
                    setTimeout(() => {
                        onLogin(res.user.PK.replace('USER#', ''));
                    }, 1000);
                } else {
                    setError(res.error || 'Có lỗi xảy ra trong quá trình đăng ký!');
                }
            }
        } catch (err) {
            let msg = err.message || 'Đăng ký tài khoản thất bại!';
            // Translate Cognito password policy errors to Vietnamese
            if (msg.includes('Password did not conform with policy')) {
                let subMsg = '';
                if (msg.includes('uppercase characters')) {
                    subMsg = 'cần có ít nhất 1 chữ viết hoa';
                } else if (msg.includes('lowercase characters')) {
                    subMsg = 'cần có ít nhất 1 chữ viết thường';
                } else if (msg.includes('numeric characters')) {
                    subMsg = 'cần có ít nhất 1 chữ số';
                } else if (msg.includes('symbol characters')) {
                    subMsg = 'cần có ít nhất 1 ký tự đặc biệt (ví dụ: @, #, $, ...)';
                } else {
                    subMsg = 'phải tuân theo chính sách mật khẩu bảo mật (chữ hoa, chữ thường, số, ký tự đặc biệt)';
                }
                msg = `Mật khẩu không đáp ứng tiêu chuẩn bảo mật của Cognito: Mật khẩu ${subMsg}.`;
            } else if (msg.includes('at least 8 characters')) {
                msg = 'Mật khẩu phải dài tối thiểu 8 ký tự.';
            } else if (msg.includes('An account with the given email already exists')) {
                msg = 'Tài khoản email này đã được đăng ký trước đó trên Cognito!';
            } else if (msg.includes('Username should be an email')) {
                msg = 'Địa chỉ email đăng ký không hợp lệ!';
            }
            setError(msg);
        }
    };

    const handleCodeChange = (index, value) => {
        const val = value.replace(/\D/g, ''); // keep only digits
        const newCode = [...codeArray];
        newCode[index] = val.slice(-1); // only keep last digit
        setCodeArray(newCode);

        // Auto-focus next input
        if (val && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData.length === 6) {
            const newCode = pastedData.split('');
            setCodeArray(newCode);
            inputRefs.current[5].focus();
        }
    };

    const handleConfirmSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const verificationCode = codeArray.join('');
        if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
            setError('Mã xác thực phải chứa đúng 6 chữ số!');
            return;
        }

        try {
            setSuccess('Đang kích hoạt tài khoản trên Cognito...');
            await CognitoService.confirmSignUp(email, verificationCode);
            setSuccess('Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
            setTimeout(() => {
                setTab('login');
                setSuccess('');
                setPassword('');
                setCodeArray(['', '', '', '', '', '']);
            }, 2000);
        } catch (err) {
            setError(err.message || 'Kích hoạt tài khoản thất bại! Vui lòng thử lại.');
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
            {tab !== 'confirm' && (
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
            )}

            {/* Alert boxes */}
            {error && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700, borderLeft: '4px solid var(--danger)', lineHeight: '1.4' }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700, borderLeft: '4px solid var(--success)', lineHeight: '1.4' }}>
                    {success}
                </div>
            )}

            {/* Forms rendering */}
            {tab === 'login' && (
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

                </form>
            )}

            {tab === 'register' && (
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
                            placeholder={CognitoService.isConfigured() ? "Tối thiểu 8 ký tự (chữ hoa, chữ thường, số, ký tự đặc biệt)" : "Mật khẩu tối thiểu 6 ký tự"}
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

            {tab === 'confirm' && (
                <form onSubmit={handleConfirmSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                        Mã xác thực gồm 6 chữ số đã được gửi đến email <strong>{email}</strong>. Vui lòng nhập mã để kích hoạt tài khoản Cognito.
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label className="form-label" style={{ alignSelf: 'stretch', textAlign: 'center', marginBottom: '0.75rem' }}>Mã Xác Thực (6 chữ số)</label>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                            {codeArray.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => (inputRefs.current[idx] = el)}
                                    type="text"
                                    maxLength={1}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    onPaste={handlePaste}
                                    style={{
                                        width: '3rem',
                                        height: '3.5rem',
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        textAlign: 'center',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--bg-surface-solid)',
                                        color: 'var(--text-main)',
                                        transition: 'var(--transition)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-color)';
                                    }}
                                    required
                                />
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn-generate" style={{ marginTop: '0.5rem' }}>
                        Kích Hoạt Tài Khoản
                    </button>
                    <button 
                        type="button" 
                        onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--primary)', 
                            fontSize: '0.85rem', 
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            fontWeight: 700 
                        }}
                    >
                        ← Quay lại Đăng nhập
                    </button>
                </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ℹ️ <em>Tính năng xác thực được kết nối trực tiếp với dịch vụ AWS Cognito User Pool.</em>
            </div>
            
            {/* Cognito Error Troubleshooting Guide */}
            {error && error.includes('USER_PASSWORD_AUTH') && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-surface-solid)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>🛠️ Cách sửa lỗi USER_PASSWORD_AUTH:</strong>
                    <ol style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                        <li>Vào AWS Console ➔ <strong>Cognito</strong> ➔ Chọn User Pool của bạn.</li>
                        <li>Chuyển sang tab <strong>App integration</strong>.</li>
                        <li>Cuộn xuống dưới cùng và click vào tên App Client của bạn (ví dụ: <code>React-Client-App</code>).</li>
                        <li>Ở mục <strong>Authentication flows</strong>, chọn <strong>Edit</strong>.</li>
                        <li>Tích chọn vào dòng <strong>ALLOW_USER_PASSWORD_AUTH</strong> (hoặc <em>User password-based authentication</em>).</li>
                        <li>Nhấp <strong>Save changes</strong> để lưu lại và thử đăng nhập lại trên web!</li>
                    </ol>
                </div>
            )}
        </div>
    );
}

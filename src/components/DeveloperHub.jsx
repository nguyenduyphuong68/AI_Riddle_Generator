import React, { useState } from 'react';
import { 
    awsArchitectureDiagram, 
    singleTableVisualSchema, 
    lambdaPythonCode, 
    lambdaLibraryCode, 
    lambdaProfileCode,
    dynamoDbTransactionCode, 
    awsSetupSteps 
} from '../data/aws-guide';

export default function DeveloperHub() {
    const [activeSubTab, setActiveSubTab] = useState('architecture');

    return (
        <section id="developer-hub-view" className="view-section">
            <div className="glass-panel" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🛠️</span>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Developer Hub</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Bảng điều khiển thông tin cấu hình AWS Serverless & Hướng dẫn Tích hợp dành cho Lập trình viên</p>
                    </div>
                </div>

                {/* Sub Tab Navigation */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <button 
                        className={`nav-link ${activeSubTab === 'architecture' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('architecture')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        🗺️ Sơ đồ Kiến trúc
                    </button>
                    <button 
                        className={`nav-link ${activeSubTab === 'dynamodb' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('dynamodb')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        📊 Single-Table Design
                    </button>
                    <button 
                        className={`nav-link ${activeSubTab === 'lambda' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('lambda')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        🐍 AWS Lambda Python Code
                    </button>
                    <button 
                        className={`nav-link ${activeSubTab === 'lambda-library' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('lambda-library')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        📚 Library Lambda Code
                    </button>
                    <button 
                        className={`nav-link ${activeSubTab === 'lambda-profile' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('lambda-profile')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        👤 Profile Lambda Code
                    </button>
                    <button 
                        className={`nav-link ${activeSubTab === 'transaction' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('transaction')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        🔗 Upvote Transaction
                    </button>
                    <button 
                        className={`nav-link ${activeSubTab === 'setup' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('setup')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        ⚙️ Các Bước Thiết Lập AWS
                    </button>
                </div>

                {/* Tab Contents */}
                <div className="sub-tab-content">
                    {activeSubTab === 'architecture' && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Luồng Tích Hợp AWS Serverless & Amplify
                            </h3>
                            <pre style={{ 
                                backgroundColor: 'var(--bg-surface-solid)', 
                                border: '1px solid var(--border-color)', 
                                padding: '1rem', 
                                borderRadius: 'var(--radius-md)', 
                                overflowX: 'auto',
                                fontFamily: 'Consolas, Monaco, monospace',
                                fontSize: '0.9rem',
                                color: 'var(--text-main)',
                                lineHeight: '1.4'
                            }}>
                                {awsArchitectureDiagram}
                            </pre>
                        </div>
                    )}

                    {activeSubTab === 'dynamodb' && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Mô Hình Dữ Liệu Thiết Kế Một Bảng (Single-Table Design)
                            </h3>
                            <pre style={{ 
                                backgroundColor: 'var(--bg-surface-solid)', 
                                border: '1px solid var(--border-color)', 
                                padding: '1rem', 
                                borderRadius: 'var(--radius-md)', 
                                overflowX: 'auto',
                                fontFamily: 'Consolas, Monaco, monospace',
                                fontSize: '0.85rem',
                                color: 'var(--text-main)',
                                lineHeight: '1.4'
                            }}>
                                {singleTableVisualSchema}
                            </pre>
                            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                <ul>
                                    <li><strong>Partition Key (PK)</strong> và <strong>Sort Key (SK)</strong> đóng vai trò định danh bản ghi trong bảng DynamoDB duy nhất.</li>
                                    <li>Chỉ mục phụ toàn cục <strong>GSI1 (GSI1PK, GSI1SK)</strong> được sử dụng để lấy danh sách câu đố nổi bật ở tab Cộng đồng sắp xếp theo lượt upvote.</li>
                                    <li>Điều kiện ghi nhận <strong>UPVOTE</strong> ngăn cản việc trùng lặp lượt bầu chọn của người dùng đối với một câu đố cụ thể.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeSubTab === 'lambda' && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Python Lambda Code (Gọi Amazon Bedrock Claude 3.5 & Lưu DynamoDB)
                            </h3>
                            <pre style={{ 
                                backgroundColor: 'var(--bg-surface-solid)', 
                                border: '1px solid var(--border-color)', 
                                padding: '1rem', 
                                borderRadius: 'var(--radius-md)', 
                                overflowX: 'auto',
                                fontFamily: 'Consolas, Monaco, monospace',
                                fontSize: '0.85rem',
                                color: 'var(--text-main)',
                                lineHeight: '1.4',
                                maxHeight: '500px'
                            }}>
                                {lambdaPythonCode}
                            </pre>
                        </div>
                    )}

                    {activeSubTab === 'lambda-library' && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Python Library Lambda Code (Quản lý Thư viện: Query, Save, Delete từ DynamoDB)
                            </h3>
                            <pre style={{ 
                                backgroundColor: 'var(--bg-surface-solid)', 
                                border: '1px solid var(--border-color)', 
                                padding: '1rem', 
                                borderRadius: 'var(--radius-md)', 
                                overflowX: 'auto',
                                fontFamily: 'Consolas, Monaco, monospace',
                                fontSize: '0.85rem',
                                color: 'var(--text-main)',
                                lineHeight: '1.4',
                                maxHeight: '500px'
                            }}>
                                {lambdaLibraryCode}
                            </pre>
                        </div>
                    )}

                    {activeSubTab === 'lambda-profile' && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Python Profile Lambda Code (Lưu thông tin hồ sơ tài khoản xuống DynamoDB)
                            </h3>
                            <pre style={{ 
                                backgroundColor: 'var(--bg-surface-solid)', 
                                border: '1px solid var(--border-color)', 
                                padding: '1rem', 
                                borderRadius: 'var(--radius-md)', 
                                overflowX: 'auto',
                                fontFamily: 'Consolas, Monaco, monospace',
                                fontSize: '0.85rem',
                                color: 'var(--text-main)',
                                lineHeight: '1.4',
                                maxHeight: '500px'
                            }}>
                                {lambdaProfileCode}
                            </pre>
                        </div>
                    )}

                    {activeSubTab === 'transaction' && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                                Node.js Upvote Transaction Code (Đảm bảo tính toàn vẹn dữ liệu)
                            </h3>
                            <pre style={{ 
                                backgroundColor: 'var(--bg-surface-solid)', 
                                border: '1px solid var(--border-color)', 
                                padding: '1rem', 
                                borderRadius: 'var(--radius-md)', 
                                overflowX: 'auto',
                                fontFamily: 'Consolas, Monaco, monospace',
                                fontSize: '0.85rem',
                                color: 'var(--text-main)',
                                lineHeight: '1.4',
                                maxHeight: '500px'
                            }}>
                                {dynamoDbTransactionCode}
                            </pre>
                        </div>
                    )}

                    {activeSubTab === 'setup' && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                                5 Bước Triển Khai và Thiết Lập Hệ Thống Lên Cloud AWS
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {awsSetupSteps.map((step, idx) => (
                                    <div key={idx} style={{ 
                                        padding: '1rem', 
                                        backgroundColor: 'var(--bg-surface-solid)', 
                                        border: '1px solid var(--border-color)', 
                                        borderRadius: 'var(--radius-md)' 
                                    }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--text-main)' }}>{step.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.details}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

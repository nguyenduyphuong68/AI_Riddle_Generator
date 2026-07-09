import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Generator from './components/Generator';
import Community from './components/Community';
import Library from './components/Library';
import CognitoAuth from './components/CognitoAuth';
import { DynamoDBClient } from './data/db';

export default function App() {
    // SPA Routing & Theme States
    const [activeTab, setActiveTab] = useState('generator');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Cognito Authentication States
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('usr_123456');

    // Local DB States (reactively sync with LocalStorage DynamoDB simulator)
    const [riddles, setRiddles] = useState([]);
    const [libraryRiddles, setLibraryRiddles] = useState([]);

    // Hydrate database on mount/login
    useEffect(() => {
        setRiddles(DynamoDBClient.getAllRiddles());
        setLibraryRiddles(DynamoDBClient.getUserLibrary(currentUserId));
    }, [currentUserId, isLoggedIn]);

    // Sync theme with DOM attributes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Authentication Handlers
    const handleLogin = (userId) => {
        setCurrentUserId(userId);
        setIsLoggedIn(true);
        setActiveTab('generator'); // Direct to generator after login
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUserId('u102');
        setActiveTab('generator');
    };

    const handleRegister = (name, email, role) => {
        return DynamoDBClient.registerUser(name, email, role);
    };

    const handleLoginClick = () => {
        setActiveTab('auth'); // Switch to authentication page
    };

    // Callback: Create/Save Riddle to Library
    const handleSaveRiddle = (riddleData) => {
        DynamoDBClient.saveRiddle(currentUserId, riddleData);
        setLibraryRiddles(DynamoDBClient.getUserLibrary(currentUserId));
    };

    // Callback: Delete Riddle
    const handleDeleteRiddle = (riddleId) => {
        DynamoDBClient.deleteRiddle(currentUserId, riddleId);
        setLibraryRiddles(DynamoDBClient.getUserLibrary(currentUserId));
    };

    // Callback: Upvote Riddle
    const handleUpvoteRiddle = (riddleId) => {
        DynamoDBClient.upvoteRiddle(currentUserId, riddleId);
        setRiddles(DynamoDBClient.getAllRiddles());
    };

    const profiles = DynamoDBClient.getProfiles();
    const currentUser = isLoggedIn ? profiles.find(p => p.PK === `USER#${currentUserId}`) : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navigation Header */}
            <Header 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                theme={theme}
                toggleTheme={toggleTheme}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                onLogout={handleLogout}
                onLoginClick={handleLoginClick}
            />

            {/* Main Section */}
            <main>
                {activeTab === 'generator' && (
                    <Generator 
                        currentUserId={currentUserId}
                        onSaveRiddle={handleSaveRiddle} 
                        isLoggedIn={isLoggedIn}
                        onRequireLogin={handleLoginClick}
                    />
                )}

                {activeTab === 'featured' && (
                    !isLoggedIn ? (
                        <CognitoAuth onLogin={handleLogin} onRegister={handleRegister} />
                    ) : (
                        <Community 
                            currentUserId={currentUserId}
                            riddles={riddles}
                            onUpvoteRiddle={handleUpvoteRiddle}
                            onSaveRiddle={handleSaveRiddle}
                            savedRiddles={libraryRiddles}
                        />
                    )
                )}

                {activeTab === 'library' && (
                    !isLoggedIn ? (
                        <CognitoAuth onLogin={handleLogin} onRegister={handleRegister} />
                    ) : (
                        <Library 
                            libraryRiddles={libraryRiddles}
                            onDeleteRiddle={handleDeleteRiddle}
                        />
                    )
                )}

                {activeTab === 'auth' && (
                    <CognitoAuth onLogin={handleLogin} onRegister={handleRegister} />
                )}
            </main>

            {/* Footer */}
            <footer>
                <p>© 2026 AI Riddle Generator. Dự án Thực tập AWS Cloud Serverless - Nhóm Phát triển.</p>
            </footer>
        </div>
    );
}

/* ==========================================================================
   AI Riddle Generator - AWS API Gateway Fetch Client Service (Robust Proxy Guard)
   ========================================================================== */

// Base Stage URL (e.g. "https://aykli87i0k.execute-api.ap-southeast-1.amazonaws.com/dev")
const BASE_API_URL = import.meta.env.REACT_APP_API_URL || '';
const CLEAN_BASE_URL = BASE_API_URL.replace(/\/+$/, '');

const GENERATE_API_URL = CLEAN_BASE_URL ? `${CLEAN_BASE_URL}/riddles/generate` : '';
const EXPORT_API_URL = CLEAN_BASE_URL ? `${CLEAN_BASE_URL}/riddles/export` : '';

export const APIService = {
    isConfigured: () => {
        return !!CLEAN_BASE_URL;
    },

    getApiUrl: () => {
        return GENERATE_API_URL;
    },

    // 1. Invoke /riddles/generate (POST)
    generateRiddle: async (payload) => {
        if (!GENERATE_API_URL) {
            throw new Error("REACT_APP_API_URL is not configured in environment variables.");
        }

        const formattedPayload = {
            keyword: payload.keyword,
            age_group: payload.age_group,
            genre: payload.genre,
            topic: payload.topic || 'Địa lý',
            language: payload.language || 'vi',
            user_id: payload.user_id || 'usr_123456',
            creator_role: payload.creator_role || 'Teacher'
        };

        console.log("Sending POST payload to:", GENERATE_API_URL);
        const response = await fetch(GENERATE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedPayload)
        });

        if (!response.ok) {
            throw new Error(`API Gateway error! Status: ${response.status}`);
        }

        let result = await response.json();
        console.log("API Gateway Response:", result);

        // Safeguard: If "Use Lambda Proxy Integration" is OFF in API Gateway
        if (result && typeof result === 'object' && result.statusCode !== undefined && result.body !== undefined) {
            console.warn("Lambda Proxy Integration is disabled on API Gateway. Unwrapping nested response...");
            
            const nestedStatus = Number(result.statusCode);
            const nestedBody = JSON.parse(result.body || '{}');
            
            if (nestedStatus >= 400) {
                throw new Error(nestedBody.message || `API error with status ${nestedStatus}`);
            }
            result = nestedBody;
        }

        return result;
    },

    // 2. Invoke /riddles/export (POST)
    exportRiddle: async (riddleData) => {
        if (!EXPORT_API_URL) {
            throw new Error("Export endpoint could not be derived from API URL.");
        }

        console.log("Sending Export payload to:", EXPORT_API_URL);
        const response = await fetch(EXPORT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(riddleData)
        });

        if (!response.ok) {
            throw new Error(`API Gateway export error! Status: ${response.status}`);
        }

        let result = await response.json();
        console.log("Export API Response:", result);

        // Safeguard: If "Use Lambda Proxy Integration" is OFF in API Gateway
        if (result && typeof result === 'object' && result.statusCode !== undefined && result.body !== undefined) {
            console.warn("Lambda Proxy Integration is disabled on API Gateway. Unwrapping nested response...");
            
            const nestedStatus = Number(result.statusCode);
            const nestedBody = JSON.parse(result.body || '{}');
            
            if (nestedStatus >= 400) {
                throw new Error(nestedBody.message || `API error with status ${nestedStatus}`);
            }
            result = nestedBody;
        }

        return result;
    },

    // 3. Fetch User Library (GET)
    fetchUserLibrary: async (userId) => {
        if (!CLEAN_BASE_URL) throw new Error("API URL is not configured.");
        const url = `${CLEAN_BASE_URL}/riddles/library?userId=${encodeURIComponent(userId)}`;
        
        console.log("Fetching library from:", url);
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`API Gateway library fetch error! Status: ${response.status}`);
        }

        let result = await response.json();
        
        // Unwrap Lambda proxy integration nested response if present
        if (result && typeof result === 'object' && result.statusCode !== undefined && result.body !== undefined) {
            result = JSON.parse(result.body || '[]');
        }
        return result;
    },

    // 4. Save Riddle to Library (POST)
    saveRiddleToLibrary: async (userId, riddleData) => {
        if (!CLEAN_BASE_URL) throw new Error("API URL is not configured.");
        const url = `${CLEAN_BASE_URL}/riddles/library`;

        const payload = {
            userId: userId,
            riddle: riddleData
        };

        console.log("Saving to library via:", url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Gateway library save error! Status: ${response.status}`);
        }

        let result = await response.json();
        if (result && typeof result === 'object' && result.statusCode !== undefined && result.body !== undefined) {
            result = JSON.parse(result.body || '{}');
        }
        return result;
    },

    // 5. Delete Riddle from Library (DELETE)
    deleteRiddleFromLibrary: async (userId, riddleId) => {
        if (!CLEAN_BASE_URL) throw new Error("API URL is not configured.");
        const url = `${CLEAN_BASE_URL}/riddles/library?userId=${encodeURIComponent(userId)}&riddleId=${encodeURIComponent(riddleId)}`;

        console.log("Deleting from library via:", url);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`API Gateway library delete error! Status: ${response.status}`);
        }

        let result = await response.json();
        if (result && typeof result === 'object' && result.statusCode !== undefined && result.body !== undefined) {
            result = JSON.parse(result.body || '{}');
        }
        return result;
    },

    // 6. Save User Profile to DynamoDB (POST)
    saveUserProfile: async (userId, profileData) => {
        if (!CLEAN_BASE_URL) throw new Error("API URL is not configured.");
        const url = `${CLEAN_BASE_URL}/riddles/profile`;

        const payload = {
            userId: userId,
            profile: profileData
        };

        console.log("Saving user profile via:", url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Gateway profile save error! Status: ${response.status}`);
        }

        let result = await response.json();
        if (result && typeof result === 'object' && result.statusCode !== undefined && result.body !== undefined) {
            result = JSON.parse(result.body || '{}');
        }
        return result;
    }
};

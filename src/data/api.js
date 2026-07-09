/* ==========================================================================
   AI Riddle Generator - AWS API Gateway Fetch Client Service
   ========================================================================== */

const GENERATE_API_URL = import.meta.env.REACT_APP_API_URL || '';
const EXPORT_API_URL = GENERATE_API_URL ? GENERATE_API_URL.replace('/generate', '/export') : '';

export const APIService = {
    isConfigured: () => {
        return !!GENERATE_API_URL;
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
            topic: payload.topic || 'Chung',
            language: payload.language || 'vi',
            user_id: payload.user_id || 'usr_guest',
            creator_role: payload.creator_role || 'Guest'
        };

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

        return await response.json();
    },

    // 2. Invoke /riddles/export (POST)
    exportRiddle: async (riddleData) => {
        if (!EXPORT_API_URL) {
            throw new Error("Export endpoint could not be derived from API URL.");
        }

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

        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            return await response.json();
        } else {
            // Treat as binary download file (PDF, Word, or octet-stream)
            return await response.blob();
        }
    }
};

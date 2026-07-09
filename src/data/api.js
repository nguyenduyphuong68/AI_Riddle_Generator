/* ==========================================================================
   AI Riddle Generator - AWS API Gateway Fetch Client Service (Amplify BaseUrl)
   ========================================================================== */

// Base Stage URL (e.g. "https://44vwnl4k95.execute-api.ap-southeast-1.amazonaws.com/dev")
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

        const result = await response.json();
        console.log("API Gateway Response:", result);
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

        const result = await response.json();
        console.log("Export API Response:", result);
        return result;
    }
};

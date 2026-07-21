/* ==========================================================================
   AI Riddle Generator - AWS Cognito Identity Provider REST Service (Fetch Client)
   ========================================================================== */

const USER_POOL_ID = import.meta.env.REACT_APP_COGNITO_USER_POOL_ID || '';
const CLIENT_ID = import.meta.env.REACT_APP_COGNITO_CLIENT_ID || '';
const REGION = import.meta.env.REACT_APP_COGNITO_REGION || '';

const ENDPOINT = REGION ? `https://cognito-idp.${REGION}.amazonaws.com/` : '';

export const CognitoService = {
    isConfigured: () => {
        return !!(USER_POOL_ID && CLIENT_ID && REGION);
    },

    // 1. Sign Up a User
    signUp: async (email, password, name, role) => {
        if (!ENDPOINT) throw new Error("Cognito Service is not configured.");

        // Custom attributes must be configured in Cognito User Pool first (e.g., custom:role)
        const payload = {
            ClientId: CLIENT_ID,
            Username: email.trim(),
            Password: password,
            UserAttributes: [
                { Name: "name", Value: name.trim() },
                { Name: "custom:role", Value: role }
            ]
        };

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Không thể đăng ký tài khoản với Cognito!");
        }

        return data;
    },

    // 1.5. Confirm Sign Up
    confirmSignUp: async (email, code) => {
        if (!ENDPOINT) throw new Error("Cognito Service is not configured.");

        const payload = {
            ClientId: CLIENT_ID,
            Username: email.trim(),
            ConfirmationCode: code.trim()
        };

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Mã xác nhận không hợp lệ hoặc đã hết hạn!");
        }

        return data;
    },

    // 2. Sign In (Authentication)
    signIn: async (email, password) => {
        if (!ENDPOINT) throw new Error("Cognito Service is not configured.");

        const payload = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email.trim(),
                PASSWORD: password
            }
        };

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Tài khoản hoặc mật khẩu không chính xác!");
        }

        return data; // returns AuthResult containing AccessToken, IdToken, RefreshToken
    },

    // 3. Decode JWT ID Token payload to extract user info (name, role, sub)
    decodeIdToken: (idToken) => {
        try {
            const parts = idToken.split('.');
            if (parts.length !== 3) return null;
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(escape(atob(base64)));
            const payload = JSON.parse(jsonPayload);
            return {
                userId: payload.sub,
                email: payload.email,
                name: payload.name || payload.email,
                role: payload['custom:role'] || 'Teacher'
            };
        } catch (e) {
            console.error("Failed to decode token:", e);
            return null;
        }
    }
};

import { getAuthTokens, setTokenCookies, Tokens } from "./tokens";

// Check if user is authenticated by verifying the tokens
export async function checkAuth(): Promise<boolean> {
    const tokens = getAuthTokens();

    const accessToken = tokens.accessToken;
    if (!accessToken) {
        return false;
    }

    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

export async function refreshTokens(refreshToken: string): Promise<Tokens | null> {
    try {
        const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
            const resp = await refreshResponse.json();

            const newTokens: Tokens = {
                accessToken: resp.access_token,
                refreshToken: resp.refresh_token
            }
            setTokenCookies(newTokens);
            return newTokens;
        }
        return null;
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        return null;
    }
}

export async function fetchUserData(accessToken: string) {
    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return { response, data: null };
        }

        const data = await response.json();
        return { response, data };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { response: null, data: null, error };
    }
}

export async function getUser() {
    const tokens = getAuthTokens();
    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;

    if (!accessToken) {
        return null;
    }

    try {
        let result = await fetchUserData(accessToken);

        if (result.response?.status === 401 && refreshToken) {
            // Try to refresh the token
            const newTokens = await refreshTokens(refreshToken);
            if (newTokens?.accessToken) {
                // Retry the original request with the new access token
                result = await fetchUserData(newTokens?.accessToken);
                console.log("new result", result);
            } else {
                // If refresh failed, return null
                return null;
            }
        }

        if (!result.response?.ok) {
            return null;
        }

        return result.data;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

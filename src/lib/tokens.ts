export interface Tokens {
    accessToken?: string;
    refreshToken?: string;
}

// Cookie names constants to ensure consistency
const COOKIE_NAMES = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken'
} as const;

export function setTokenCookies(tokens: Tokens) {
    // Set cookies with proper attributes
    if (tokens.accessToken) {
        document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=${tokens.accessToken}; path=/; SameSite=Strict; secure`;
    }
    if (tokens.refreshToken) {
        document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=${tokens.refreshToken}; path=/; SameSite=Strict; secure`;
    }
}

// Function to parse cookies string into an object
function parseCookies(cookieString: string = typeof window !== 'undefined' ? document.cookie : ''): { [key: string]: string } {
    if (!cookieString) {
        console.warn('No cookie string provided or available');
        return {};
    }


    try {
        const cookies = cookieString
            .split(';')
            .map(cookie => cookie.trim())
            .filter(cookie => cookie)
            .reduce((acc, cookie) => {
                const [key, ...valueParts] = cookie.split('=');
                const value = valueParts.join('=');
                if (key && value) {
                    acc[key.trim()] = decodeURIComponent(value.trim());
                }
                return acc;
            }, {} as { [key: string]: string });

        return cookies;
    } catch (error) {
        console.error('Error parsing cookies:', error);
        return {};
    }
}

// Get auth tokens from cookies
export function getAuthTokens(): Tokens {
    const cookies = parseCookies();
    const accessToken = cookies[COOKIE_NAMES.ACCESS_TOKEN];
    const refreshToken = cookies[COOKIE_NAMES.REFRESH_TOKEN];

    if (!accessToken || !refreshToken) {
        console.warn('Missing tokens:', { accessToken, refreshToken });
    }

    return {
        accessToken,
        refreshToken,
    };
}

// Get just the access token
export function getAccessToken(): string | undefined {
    const tokens = getAuthTokens();
    return tokens.accessToken;
}

// Get just the refresh token
export function getRefreshToken(): string | undefined {
    const tokens = getAuthTokens();
    return tokens.refreshToken;
}

// Clear auth tokens
export function clearTokens(): void {
    document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${COOKIE_NAMES.REFRESH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
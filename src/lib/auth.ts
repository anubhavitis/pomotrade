// Check if user is authenticated by verifying the tokens
export async function checkAuth(): Promise<boolean> {
    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}
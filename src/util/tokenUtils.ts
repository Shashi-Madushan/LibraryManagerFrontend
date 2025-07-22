export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expiryTime;
    } catch {
        return true;
    }
};

import apiClient from "../ApiClient";

// Get lending history for a user (authenticated users)
export const getUserLendingHistory = async (email: string) => {
    try {
        const response = await apiClient.get(`/lendings/user/${email}`);
        return response;
    } catch (error) {
        // Handle error as needed
        throw error;
    }
};

// Lend a book (admin only)
export const lendBook = async (data: any) => {
    try {
        const response = await apiClient.post('/lendings/lend', data);
        return response;
    } catch (error) {
        throw error;
    }
};

// Return a book (admin only)
export const returnBook = async (lendingId: string) => {
    try {
        const response = await apiClient.put(`/lendings/return/${lendingId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get all lendings (admin only)
export const getLendings = async () => {
    try {
        const response = await apiClient.get('/lendings/');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get lending history for a book (admin only)
export const getBookLendingHistory = async (bookName: string) => {
    try {
        const response = await apiClient.get(`/lendings/book/${bookName}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get overdue lendings (admin only)
export const getOverdueLendings = async () => {
    try {
        const response = await apiClient.get('/lendings/overdue');
        return response;
    } catch (error) {
        throw error;
    }
};
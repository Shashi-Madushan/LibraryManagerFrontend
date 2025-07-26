import apiClient from "../ApiClient";

// Get lending history for a user (authenticated users)
export const getUserLendingHistory = async (userId: string) => {
    try {
        const response = await apiClient.get(`/lending/user/${userId}`);
        return response;
    } catch (error) {
        // Handle error as needed
        throw error;
    }
};

// Lend a book (admin only)
export const lendBook = async (data: any) => {
    try {
        const response = await apiClient.post('/lending/lend', data);
        return response;
    } catch (error) {
        throw error;
    }
};

// Return a book (admin only)
export const returnBook = async (lendingId: string, data: any) => {
    try {
        const response = await apiClient.put(`/lending/return/${lendingId}`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get all lendings (admin only)
export const getLendings = async () => {
    try {
        const response = await apiClient.get('/lending/');
        return response;
    } catch (error) {
        throw error;
    }
};

// Get lending history for a book (admin only)
export const getBookLendingHistory = async (bookId: string) => {
    try {
        const response = await apiClient.get(`/lending/book/${bookId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Get overdue lendings (admin only)
export const getOverdueLendings = async () => {
    try {
        const response = await apiClient.get('/lending/overdue');
        return response;
    } catch (error) {
        throw error;
    }
};
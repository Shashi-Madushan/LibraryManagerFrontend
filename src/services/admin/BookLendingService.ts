import apiClient from "../ApiClient";

// Get user's lending history
export const getUserLendingHistory = async (userId: string) => {
    try {
        return await apiClient.get(`/lending/user/${userId}`);
    } catch (error) {
        throw error;
    }
};

// Lend a book to a user
export const lendBook = async (data: { userId: string; bookId: string; dueDate: string }) => {
    try {
        return await apiClient.post('/lending/lend', data);
    } catch (error) {
        throw error;
    }
};

// Return a borrowed book
export const returnBook = async (lendingId: string) => {
    try {
        return await apiClient.put(`/lending/return/${lendingId}`);
    } catch (error) {
        throw error;
    }
};

// Get all lendings
export const getLendings = async () => {
    try {
        return await apiClient.get('/lending');
    } catch (error) {
        throw error;
    }
};

// Get lending history for a specific book
export const getBookLendingHistory = async (bookId: string) => {
    try {
        return await apiClient.get(`/lending/book/${bookId}`);
    } catch (error) {
        throw error;
    }
};

// Get all overdue lendings
export const getOverdueLendings = async () => {
    try {
        return await apiClient.get('/lending/overdue');
    } catch (error) {
        throw error;
    }
};

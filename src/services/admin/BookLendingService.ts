import apiClient from "../ApiClient";

// Get user's lending history
export const getUserLendingHistory = async (userId: string) => {
    return await apiClient.get(`/lending/user/${userId}`);
};

// Lend a book to a user
export const lendBook = async (data: { userId: string; bookId: string; dueDate: string }) => {
    return await apiClient.post('/lending/lend', data);
};

// Return a borrowed book
export const returnBook = async (lendingId: string) => {
    return await apiClient.put(`/lending/return/${lendingId}`);
};

// Get all lendings
export const getLendings = async () => {
    return await apiClient.get('/lending');
};

// Get lending history for a specific book
export const getBookLendingHistory = async (bookId: string) => {
    return await apiClient.get(`/lending/book/${bookId}`);
};

// Get all overdue lendings
export const getOverdueLendings = async () => {
    return await apiClient.get('/lending/overdue');
};

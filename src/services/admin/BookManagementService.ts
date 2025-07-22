import apiClient from "../ApiClient";
import type { Book } from "../../types/Book";

// Public routes
export const getAllBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get('/books');
    return response.data.data;
};

export const getBooksByCategory = async (category: string): Promise<Book[]> => {
    const response = await apiClient.get(`/books/category/${category}`);
    return response.data.data;
};

export const getBookById = async (_id: string): Promise<Book> => {
    const response = await apiClient.get(`/books/${_id}`);
    return response.data.data;
};

// Admin routes
export const addBook = async (bookData: FormData): Promise<Book> => {
    const response = await apiClient.post('/books', bookData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const updateBook = async (id: string, bookData: FormData): Promise<Book> => {
    const response = await apiClient.put(`/books/${id}`, bookData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

export const deleteBook = async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/books/${id}`);
    return response.data.data;
};
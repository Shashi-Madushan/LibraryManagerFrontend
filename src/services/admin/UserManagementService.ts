import apiClient from "../ApiClient";
import type { User } from "../../types/User";

export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/user/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const activateUser = async (userId: string) => {
    try {
        const response = await apiClient.patch(`/user/activate/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error activating user:', error);
        throw error;
    }
}

export const deactivateUser = async (userId: string) => {
    try {
        const response = await apiClient.patch(`/user/deactivate/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deactivating user:', error);
        throw error;
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const response = await apiClient.delete(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// User Management endpoints
export const addUser = async (userData: Partial<User>) => {
    try {
        const response = await apiClient.post('/user', userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

export const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
        const response = await apiClient.patch(`/user/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Other endpoints
export const getUserInfo = async () => {
    try {
        const response = await apiClient.get('/user/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

export const updateUserInfo = async (userData: any) => {
    try {
        const response = await apiClient.patch('/user/update', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
}

export const changePassword = async (passwordData: { oldPassword: string; newPassword: string }) => {
    try {
        const response = await apiClient.post('/user/change-password', passwordData);
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
}

export const deleteAccount = async () => {
    try {
        const response = await apiClient.delete('/user/delete');
        return response.data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}

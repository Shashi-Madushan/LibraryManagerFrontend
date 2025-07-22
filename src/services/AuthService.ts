import apiClient from "./ApiClient";
import type{ SignupRequest, AuthResponse } from "../types/AuthTypes";
import { clearAuthData } from "../util/authStorage";

export const signup = async (signupData: SignupRequest): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/register', signupData);
        return response.data;
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
} 

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export const logout = async (): Promise<void> => {
    try {
        await apiClient.post('/auth/logout');
        clearAuthData();
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
}

export const refreshToken = async (): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/refresh-token');
        return response.data;
    } catch (error) {
        console.error("Token refresh failed:", error);
        throw error;
    }
}
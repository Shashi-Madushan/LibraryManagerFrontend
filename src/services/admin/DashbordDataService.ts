import apiClient from "../ApiClient";

export type DashboardData = {
    totalUsers: number;
    totalBooks: number;
    lendedBooks: number;
    delayedBooks: number;
};

export const getDashbordData = async (): Promise<{
    success: boolean;
    data?: DashboardData;
    error?: any;
}> => {
    try {
        const response = await apiClient.get('/dashbord');
        return response.data;
    } catch (error) {
        return { success: false, error };
    }
}
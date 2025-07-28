import apiClient from "../ApiClient";

export interface BookReminderData {
    // Define fields according to your backend BookReminderData interface
    // Example:
    bookId: string;
    title: string;
    dueDate: string;
}

export interface ReminderRequestBody {
    userId: string;
    books: BookReminderData[];
}

export const  sendReminderEmail= async (data: ReminderRequestBody) =>{
    return apiClient.post('/email/send-reminder', data);
}
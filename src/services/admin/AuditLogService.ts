import ApiClient from '../ApiClient';

export interface AuditLog {
    _id: string;
    action: string;
    performedBy: {
        _id: string;
        username: string;
        email: string;
    } | null;
    targetId: string;
    targetType: string;
    details: string;
    timestamp: string;
    __v: number;
}

export interface AuditLogResponse {
    status: string;
    data: AuditLog[];
}

export type DateRange = 'today' | 'week' | 'month';

export const AuditLogService = {
    getAuditLogs: async (range: DateRange): Promise<AuditLog[]> => {
        const response = await ApiClient.get<AuditLogResponse>(`/audit/logs?range=${range}`);
        return response.data.data;
    }
};

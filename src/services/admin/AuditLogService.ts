import ApiClient from '../ApiClient';
import type { AuditLog ,AuditLogResponse,DateRange } from '../../types/AuditLog';




export const AuditLogService = {
    getAuditLogs: async (range: DateRange): Promise<AuditLog[]> => {
        const response = await ApiClient.get<AuditLogResponse>(`/audit/logs?range=${range}`);
        return response.data.data;
    }
};

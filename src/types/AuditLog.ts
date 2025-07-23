
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
import React, { useEffect, useState } from 'react';
import type { AuditLog, DateRange } from '../../services/admin/AuditLogService';
import { AuditLogService } from '../../services/admin/AuditLogService';
import AuditLogTable from '../../components/admin/AuditLogTable';

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [selectedRange, setSelectedRange] = useState<DateRange>('week');
    const [isLoading, setIsLoading] = useState(false);

    const fetchLogs = async (range: DateRange) => {
        try {
            setIsLoading(true);
            const data = await AuditLogService.getAuditLogs(range);
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(selectedRange);
    }, [selectedRange]);

    const handleRangeChange = (range: DateRange) => {
        setSelectedRange(range);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <AuditLogTable
                    logs={logs}
                    selectedRange={selectedRange}
                    onRangeChange={handleRangeChange}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default AuditLogs;

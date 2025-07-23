import React, { useEffect, useState, useMemo } from 'react';
import type { AuditLog, DateRange } from '../../types/AuditLog';
import { AuditLogService } from '../../services/admin/AuditLogService';
import AuditLogTable from '../../components/admin/AuditLogTable';

const AuditLogs: React.FC = () => {
    const [allLogs, setAllLogs] = useState<AuditLog[]>([]);
    const [selectedRange, setSelectedRange] = useState<DateRange>('week');
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedTarget, setSelectedTarget] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchLogs = async (range: DateRange) => {
        try {
            setIsLoading(true);
            const data = await AuditLogService.getAuditLogs(range);
            setAllLogs(data);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter logs locally using useMemo
    const filteredLogs = useMemo(() => {
        return allLogs.filter(log => {
            const matchesAction = !selectedAction || log.action.startsWith(selectedAction);
            const matchesTarget = !selectedTarget || log.action.includes(selectedTarget);
            return matchesAction && matchesTarget;
        });
    }, [allLogs, selectedAction, selectedTarget]);

    useEffect(() => {
        fetchLogs(selectedRange);
    }, [selectedRange]); // Only fetch when time range changes

    const handleRangeChange = (range: DateRange) => {
        setSelectedRange(range);
    };

    const handleActionChange = (action: string) => {
        setSelectedAction(action);
    };

    const handleTargetChange = (target: string) => {
        setSelectedTarget(target);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <AuditLogTable
                    logs={filteredLogs}
                    selectedRange={selectedRange}
                    selectedAction={selectedAction}
                    selectedTarget={selectedTarget}
                    onRangeChange={handleRangeChange}
                    onActionChange={handleActionChange}
                    onTargetChange={handleTargetChange}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default AuditLogs;

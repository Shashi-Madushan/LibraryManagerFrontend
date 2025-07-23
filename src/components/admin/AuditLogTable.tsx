import React from 'react';
import type { AuditLog, DateRange } from '../../services/admin/AuditLogService';
import { format } from 'date-fns';

interface AuditLogTableProps {
    logs: AuditLog[];
    selectedRange: DateRange;
    onRangeChange: (range: DateRange) => void;
    isLoading?: boolean;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({
    logs,
    selectedRange,
    onRangeChange,
    isLoading = false
}) => {
    const rangeOptions: { value: DateRange; label: string }[] = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' }
    ];

    return (
        <div className="w-full">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-xl font-semibold">Audit Logs</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Time Range:</label>
                    <select
                        value={selectedRange}
                        onChange={(e) => onRangeChange(e.target.value as DateRange)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {rangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Performed By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">
                                    No audit logs found
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        log.action.startsWith('DELETE') 
                                            ? 'bg-red-100 text-red-800'
                                            : log.action.startsWith('UPDATE')
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : log.action.startsWith('CREATE')
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {log.action.split('_').join(' ')}
                                    </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {log.performedBy ? (
                                            <>
                                                <div className="text-sm text-gray-900">{log.performedBy.username}</div>
                                                <div className="text-sm text-gray-500">{log.performedBy.email}</div>
                                            </>
                                        ) : (
                                            <div className="text-sm text-gray-500">System</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.details}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogTable;

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getLendings, returnBook } from "../../services/admin/LendingManagementService";
import type { ILending } from "../../types/Lending";
import { FaSyncAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const LendingManagement = () => {
    // Get search/filter state from layout
    const { searchTerm, useServerSearch } = useOutletContext<{ searchTerm: string; useServerSearch: boolean }>();

    const [lendings, setLendings] = useState<ILending[]>([]);
    const [filteredLendings, setFilteredLendings] = useState<ILending[]>([]);
    const [loading, setLoading] = useState(true);
    const [returningId, setReturningId] = useState<string | null>(null);
    const [returnLoading, setReturnLoading] = useState(false);

    useEffect(() => {
        const fetchLendings = async () => {
            setLoading(true);
            try {
                const response = await getLendings();
                const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
                setLendings(data);
                setFilteredLendings(data);
            } catch (error) {
                console.error("Error fetching lendings:", error);
                setLendings([]);
                setFilteredLendings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLendings();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredLendings(lendings);
            return;
        }
        const term = searchTerm.toLowerCase();
        setFilteredLendings(
            lendings.filter(lending =>
                lending.userId?.email?.toLowerCase().includes(term) ||
                lending.bookId?.title?.toLowerCase().includes(term) ||
                lending.bookId?.author?.toLowerCase().includes(term)
            )
        );
    }, [searchTerm, lendings]);

    // Handle return book action
    const handleReturn = async (lendingId: string) => {
        setReturningId(lendingId);
    };

    const confirmReturn = async () => {
        if (!returningId) return;
        setReturnLoading(true);
        try {
            await returnBook(returningId);
            // Refresh lendings after return
            const response = await getLendings();
            const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
            setLendings(data);
            setFilteredLendings(data);
        } catch (error) {
            alert("Failed to return book.");
        } finally {
            setReturnLoading(false);
            setReturningId(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h3 className="text-2xl font-bold mb-6">Manage All Lendings</h3>
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <span className="text-gray-500 text-lg">Loading...</span>
                </div>
            ) : filteredLendings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                    <FaSearch className="text-6xl text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No matching lendings found</p>
                </div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm">
                                <th className="px-4 py-3 text-left">User Email</th>
                                <th className="px-4 py-3 text-left">Book Title</th>
                                <th className="px-4 py-3 text-left">Author</th>
                                <th className="px-4 py-3 text-left">Borrowed At</th>
                                <th className="px-4 py-3 text-left">Due Date</th>
                                <th className="px-4 py-3 text-left">Returned At</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLendings.map((lending) => (
                                <tr key={lending._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-sm">{lending.userId?.email}</td>
                                    <td className="px-4 py-3 text-sm">{lending.bookId?.title}</td>
                                    <td className="px-4 py-3 text-sm">{lending.bookId?.author}</td>
                                    <td className="px-4 py-3 text-sm">{new Date(lending.borrowedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm">{new Date(lending.dueDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm">{lending.returnedAt ? new Date(lending.returnedAt).toLocaleDateString() : "Not Returned"}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="flex items-center gap-2">
                                            {lending.isReturned ? (
                                                <FaCheckCircle className="text-green-500" title="Returned" />
                                            ) : (
                                                <FaTimesCircle className="text-yellow-500" title="Borrowed" />
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${lending.isReturned ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {lending.isReturned ? "Returned" : "Borrowed"}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-2">
                                            
                                            {!lending.isReturned && (
                                                <button
                                                    className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition"
                                                    onClick={() => handleReturn(lending._id)}
                                                    title="Return Book"
                                                    disabled={returnLoading && returningId === lending._id}
                                                >
                                                    {returnLoading && returningId === lending._id ? (
                                                        <FaSyncAlt className="animate-spin" />
                                                    ) : (
                                                        <span>Return</span>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Popup for confirming return */}
            {returningId && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Confirm Return</h2>
                        <p className="mb-6">Are you sure you want to mark this book as returned?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                                onClick={() => setReturningId(null)}
                                disabled={returnLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                                onClick={confirmReturn}
                                disabled={returnLoading}
                            >
                                {returnLoading ? "Returning..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LendingManagement;
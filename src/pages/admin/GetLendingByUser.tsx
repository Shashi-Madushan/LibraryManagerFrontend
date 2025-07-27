import { useState } from "react";
import { getUserLendingHistory } from "../../services/admin/LendingManagementService";
import type { ILending } from "../../types/Lending";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const GetLendingByUser = () => {
  const [email, setEmail] = useState("");
  const [lendings, setLendings] = useState<ILending[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      // Assuming getUserLendingHistory accepts user email
      const response = await getUserLendingHistory(email.trim());
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setLendings(data);
    } catch (error) {
      setLendings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-6 text-center">Get Lending History By User</h3>
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-3 gap-2 w-full max-w-md">
          <FaSearch className="text-gray-400 text-lg" />
          <input
            type="email"
            className="border-none outline-none px-2 py-1 w-full rounded-full text-gray-700"
            placeholder="Enter user email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center gap-2 transition"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-500 text-lg">Loading...</span>
        </div>
      ) : searched && lendings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <FaSearch className="text-6xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-500">No lending history found for this user</p>
        </div>
      ) : lendings.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
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
              {lendings.map((lending) => (
                <tr key={lending._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
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
                    <button
                      className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                      title="View Details"
                      // Add details logic if needed
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default GetLendingByUser;
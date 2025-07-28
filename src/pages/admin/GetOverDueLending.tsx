import { useEffect, useState } from "react";
import type { ILending } from "../../types/Lending";
import { getOverdueLendings } from "../../services/admin/LendingManagementService";
import { FaEnvelope, FaSearch } from "react-icons/fa";
import { sendReminderEmail } from "../../services/admin/EmailService";
import type { BookReminderData } from "../../services/admin/EmailService";
const GetOverDueLending = () => {
  const [overdueLendings, setOverdueLendings] = useState<ILending[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailingId, setEmailingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverdueLendings = async () => {
      setLoading(true);
      try {
        const result = await getOverdueLendings();
        const data = Array.isArray(result.data) ? result.data : result.data?.data || [];
        setOverdueLendings(data);
      } catch (error) {
        setOverdueLendings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOverdueLendings();
  }, []);

  const handleSendEmail = async (lendingId: string) => {
    setEmailingId(lendingId);
    try {
      const lending = overdueLendings.find(lending => lending._id === lendingId);
      if (!lending || !lending.userId || !lending.bookId) {
        alert("Invalid lending data");
        setEmailingId(null);
        return;
      }
      const reminderData: BookReminderData = {
        bookId: lending.bookId._id,
        title: lending.bookId.title,
        dueDate: lending.dueDate,
      };
      await sendReminderEmail({
        userId: lending.userId._id,
        books: [reminderData],
      });
      alert("Email sent to user!");
    } catch (error) {
      alert("Failed to send email.");
    }
    setEmailingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-6">Overdue Lendings</h3>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-500 text-lg">Loading...</span>
        </div>
      ) : overdueLendings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8">
          <FaSearch className="text-6xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-500">No overdue lendings found</p>
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
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overdueLendings.map((lending) => (
                <tr key={lending._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm">{lending.userId?.email}</td>
                  <td className="px-4 py-3 text-sm">{lending.bookId?.title}</td>
                  <td className="px-4 py-3 text-sm">{lending.bookId?.author}</td>
                  <td className="px-4 py-3 text-sm">{new Date(lending.borrowedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{new Date(lending.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition flex items-center gap-1"
                      onClick={() => handleSendEmail(lending._id)}
                      disabled={emailingId === lending._id}
                      title="Send Email"
                    >
                      {emailingId === lending._id ? (
                        <span className="animate-pulse">Sending...</span>
                      ) : (
                        <>
                          <FaEnvelope />
                          <span>Email</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetOverDueLending;
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { User } from '../../types/User';
import { getAllUsers, activateUser, deactivateUser, deleteUser, addUser, updateUser } from '../../services/admin/UserManagementService';
import { FaEye, FaTrash, FaCheck, FaBan, FaEdit, FaPlus } from 'react-icons/fa';
import UserFormModal from '../../components/admin/UserFormModal';

const UserManagement = () => {
  // Get search/filter state from layout
  const { searchTerm, useServerSearch } = useOutletContext<{ searchTerm: string; useServerSearch: boolean }>();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = users.filter((user) => 
      user.email.toLowerCase().includes(searchTermLower) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTermLower)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log('API Response:', response);
      
      if (response && response.users) {
        setUsers(response.users);
        setFilteredUsers(response.users);
        setError(null);
      } else {
        setUsers([]);
        setFilteredUsers([]);
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await activateUser(userId);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to activate user');
      console.error('Error activating user:', err);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await deactivateUser(userId);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to deactivate user');
      console.error('Error deactivating user:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      fetchUsers(); 
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setModalMode('edit');
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmitUser = async (userData: Partial<User>) => {
    try {
      if (modalMode === 'add') {
        const response = await addUser(userData);
        if (response.success) {
          setSuccessData(response.data);
        }
      } else if (modalMode === 'edit' && editingUser?._id) {
        // Remove any undefined or null values from userData
        const cleanedData = Object.fromEntries(
          Object.entries(userData).filter(([_, value]) => value != null)
        );
        await updateUser(editingUser._id, cleanedData);
      }
      fetchUsers();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError(`Failed to ${modalMode} user`);
      console.error(`Error ${modalMode}ing user:`, err);
      throw err;
    }
  };

  const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  const UserDetailsModal = ({ user }: { user: User }) => (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">User Details</h3>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Username</span>
            <span className="text-base font-medium text-gray-900">{user.username}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-base font-medium text-gray-900">{user.email}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Full Name</span>
            <span className="text-base font-medium text-gray-900">{user.firstName} {user.lastName}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Role</span>
            <span className="text-base font-medium text-gray-900 capitalize">{user.role}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
              ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSelectedUser(null)}
          className="mt-8 w-full px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  );

  const ActionButton = ({ onClick, icon: Icon, title, colorClass }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-2 rounded-md transition-all duration-200
        ${colorClass} hover:shadow-md active:scale-95`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const SuccessModal = ({ data, onClose }: { data: any; onClose: () => void }) => (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Created Successfully</h3>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2"><span className="font-semibold">Username:</span> {data.username}</p>
            <p className="text-sm text-gray-600 mb-2"><span className="font-semibold">Email:</span> {data.email}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Role:</span> {data.role}</p>
          </div>
          <button
            onClick={() => onClose()}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Users" value={totalUsers} color="text-blue-600" />
        <StatCard title="Active Users" value={activeUsers} color="text-green-600" />
        <StatCard title="Inactive Users" value={inactiveUsers} color="text-red-600" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm">Username</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm">Full Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm">Role</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.email} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm">{user.username}</td>
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm">{user.email}</td>
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm">{user.firstName} {user.lastName}</td>
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm">{user.role}</td>
                  <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm">
                    <span className={`px-2 py-1 rounded text-xs sm:text-sm ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <div className="flex gap-2">
                      <ActionButton
                        onClick={() => setSelectedUser(user)}
                        icon={FaEye}
                        title="View Details"
                        colorClass="bg-blue-100 text-blue-600 hover:bg-blue-200"
                      />
                      <ActionButton
                        onClick={() => handleOpenEditModal(user)}
                        icon={FaEdit}
                        title="Edit User"
                        colorClass="bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      />
                      {user.isActive ? (
                        <ActionButton
                          onClick={() => handleDeactivateUser(user._id)}
                          icon={FaBan}
                          title="Deactivate User"
                          colorClass="bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        />
                      ) : (
                        <ActionButton
                          onClick={() => handleActivateUser(user._id)}
                          icon={FaCheck}
                          title="Activate User"
                          colorClass="bg-green-100 text-green-600 hover:bg-green-200"
                        />
                      )}
                      <ActionButton
                        onClick={() => handleDeleteUser(user._id)}
                        icon={FaTrash}
                        title="Delete User"
                        colorClass="bg-red-100 text-red-600 hover:bg-red-200"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && <UserDetailsModal user={selectedUser} />}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        user={editingUser ? { ...editingUser, password: '' } : undefined}
        mode={modalMode}
      />
      {successData && <SuccessModal data={successData} onClose={() => setSuccessData(null)} />}

      {/* Add the floating action button */}
      <button
        onClick={handleOpenAddModal}
        className="fixed right-8 bottom-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700  flex items-center justify-center z-10 hover:scale-110 transform transition-transform"
        title="Add New User"
      >
        <FaPlus className="w-6 h-6" />
      </button>
    </div>
  );
};





export default UserManagement;


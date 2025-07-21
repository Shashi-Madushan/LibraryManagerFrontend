import { useState, useEffect } from 'react';
import type { User } from '../../types/User';
import { getAllUsers, activateUser, deactivateUser, deleteUser, addUser, updateUser } from '../../services/admin/UserManagementService';
import { FaEye, FaTrash, FaCheck, FaBan, FaEdit, FaPlus } from 'react-icons/fa';
import UserFormModal from '../../components/admin/UserFormModal';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log('API Response:', response);
      
      if (response && response.users) {
        setUsers(response.users);
        setError(null);
      } else {
        setUsers([]);
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      setUsers([]);
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
      fetchUsers(); // Refresh the list
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
        await addUser(userData);
      } else {
        if (editingUser?._id) {
          await updateUser(editingUser._id, userData);
        }
      }
      fetchUsers();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError(`Failed to ${modalMode} user`);
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
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <h3 className="text-xl font-bold mb-4">User Details</h3>
        <div className="space-y-2">
          <p><span className="font-semibold">Username:</span> {user.username}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Full Name:</span> {user.firstName} {user.lastName}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">Status:</span> {user.isActive ? 'Active' : 'Inactive'}</p>
        </div>
        <button
          onClick={() => setSelectedUser(null)}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add New User
        </button>
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
              {users?.map((user) => (
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
        user={editingUser || undefined}
        mode={modalMode}
      />
    </div>
  );
};

export default UserManagement;

  
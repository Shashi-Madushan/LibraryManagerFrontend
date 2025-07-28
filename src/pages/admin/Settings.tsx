import React, { useState } from "react";
import { changePassword, deleteAccount, updateMyInfo } from "../../services/admin/UserManagementService";
import { FiUser, FiMail, FiLock, FiTrash2, FiEdit2 } from "react-icons/fi";

const Settings = () => {
  // State for update info
  const [info, setInfo] = useState({ name: "", email: "" });
  const [infoMsg, setInfoMsg] = useState("");

  // State for password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  // State for delete account
  const [deleteMsg, setDeleteMsg] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Handlers
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateMyInfo(info);
      setInfoMsg(res?.message || "Info updated successfully.");
    } catch {
      setInfoMsg("Failed to update info.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPwMsg("Please fill both fields.");
      return;
    }
    try {
      const res = await changePassword({ oldPassword, newPassword });
      setPwMsg(res?.message || "Password changed successfully.");
    } catch {
      setPwMsg("Failed to change password.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await deleteAccount();
      setDeleteMsg(res?.message || "Account deleted.");
      setShowDeletePopup(false);
      // Optionally redirect or log out
    } catch {
      setDeleteMsg("Failed to delete account.");
      setShowDeletePopup(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen relative">
      {/* Popup for delete confirmation */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-white bg-opacity-40 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-sm w-full z-10 flex flex-col items-center">
            <FiTrash2 className="text-red-600 text-5xl mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-800">Delete Account</h4>
            <p className="mb-6 text-gray-600 text-center">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={handleDeleteAccount}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Settings</h2>
        <div className="grid gap-8">
          {/* Update Info Card */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
              <FiUser className="text-blue-600 text-4xl" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center mb-2">
                <FiEdit2 className="mr-2 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-700">Update Info</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1 flex items-center">
                    <FiUser className="mr-1" /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={info.name}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1 flex items-center">
                    <FiMail className="mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={info.email}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleUpdateInfo}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              {infoMsg && (
                <div className="mt-2 text-green-600 font-medium">{infoMsg}</div>
              )}
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
              <FiLock className="text-yellow-600 text-4xl" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center mb-2">
                <FiEdit2 className="mr-2 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-700">Change Password</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1 flex items-center">
                    <FiLock className="mr-1" /> Old Password
                  </label>
                  <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1 flex items-center">
                    <FiLock className="mr-1" /> New Password
                  </label>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleChangePassword}
                className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
              >
                Change Password
              </button>
              {pwMsg && (
                <div className="mt-2 text-green-600 font-medium">{pwMsg}</div>
              )}
            </div>
          </div>

          {/* Delete Account Card */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
              <FiTrash2 className="text-red-600 text-4xl" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center mb-2">
                <FiEdit2 className="mr-2 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-700">Delete Account</h3>
              </div>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                onClick={() => setShowDeletePopup(true)}
              >
                Delete Account
              </button>
              {deleteMsg && (
                <div className="mt-2 text-red-600 font-medium">{deleteMsg}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
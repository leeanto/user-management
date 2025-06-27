import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import type { User } from "../types";
import ConfirmDialog from "./ConfirmDialog";
import UserForm from "./UserForm";

const UserList: React.FC = () => {
  const { users, deleteUser } = useUserContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteUser(deleteTargetId);
      setDeleteTargetId(null);
    }
    setConfirmOpen(false);
  };

  return (
    <div className="w-full max-w-md md:max-w-xl p-3 sm:p-4 mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        User Management
      </h2>

      <UserForm defaultValues={selectedUser} onResetEditing={() => setSelectedUser(null)} />

      <div className="mt-6 sm:mt-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">User List</h3>
        {users.length === 0 ? (
          <p className="text-gray-600 text-center py-4 border rounded-lg">
            No users added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-left min-w-[600px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-sm sm:text-base">Name</th>
                  <th className="p-2 border text-sm sm:text-base">Age</th>
                  <th className="p-2 border text-sm sm:text-base">Gender</th>
                  <th className="p-2 border text-sm sm:text-base">State</th>
                  <th className="p-2 border text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2 border text-sm sm:text-base">{user.name}</td>
                    <td className="p-2 border text-sm sm:text-base">{user.age}</td>
                    <td className="p-2 border text-sm sm:text-base">{user.gender}</td>
                    <td className="p-2 border text-sm sm:text-base">{user.state}</td>
                    <td className="p-2 border">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white rounded text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Deletion"
        content="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default UserList;
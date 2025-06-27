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
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <UserForm defaultValues={selectedUser} onResetEditing={() => setSelectedUser(null)} />

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">User List</h3>
        {users.length === 0 ? (
          <p className="text-gray-600">No users added yet.</p>
        ) : (
          <table className="w-full border text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Gender</th>
                <th className="p-2 border">State</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.age}</td>
                  <td className="p-2 border">{user.gender}</td>
                  <td className="p-2 border">{user.state}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

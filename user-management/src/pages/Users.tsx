import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

const Users = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>
        <UserForm />
        <hr className="my-6" />
        <UserList />
      </div>
    </div>
  );
};

export default Users;

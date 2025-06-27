import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the User Management App</h1>
      <p className="text-lg mb-6">Click below to manage users</p>
      <Link
        to="/users"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
      >
        Go to User Management
      </Link>
      
    </div>
  );
};

export default Home;

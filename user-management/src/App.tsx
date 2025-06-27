import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserList from "./components/UserList";
import Users from "./pages/Users";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
};

export default App;

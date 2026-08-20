// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/RegisterAdmin";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/register-admin"
          element={<RegisterAdmin />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/admin"
          element={<AdminPanel />}
        />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  register,
  registerAuthor,
} from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    recoveryPasskey: "",
    role: "reader",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        recoveryPasskey: formData.recoveryPasskey,
      };

      let data;

      if (formData.role === "author") {
        data = await registerAuthor(payload);
      } else {
        data = await register(payload);
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      alert("Registration successful");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="recoveryPasskey"
            placeholder="Recovery Passkey"
            value={formData.recoveryPasskey}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="reader">Reader</option>
            <option value="author">Author</option>
          </select>

          <button type="submit">
            Register
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Register;

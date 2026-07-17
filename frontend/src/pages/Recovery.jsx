import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  resetPassword,
  verifyRecoveryPasskey,
} from "../services/authService";

function Recovery() {
  const navigate = useNavigate();

  const [recoveryToken, setRecoveryToken] = useState("");
  const [verifyForm, setVerifyForm] = useState({
    email: "",
    recoveryPasskey: "",
  });
  const [password, setPassword] = useState("");

  const handleVerifyChange = (e) => {
    setVerifyForm({
      ...verifyForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const data = await verifyRecoveryPasskey(verifyForm);

      setRecoveryToken(data.recoveryToken);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Recovery verification failed"
      );
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const data = await resetPassword({
        recoveryToken,
        password,
      });

      alert(data.message);
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Password reset failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Password Recovery</h2>

        {!recoveryToken ? (
          <form onSubmit={handleVerify}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={verifyForm.email}
              onChange={handleVerifyChange}
              required
            />

            <input
              type="password"
              name="recoveryPasskey"
              placeholder="Recovery Passkey"
              value={verifyForm.recoveryPasskey}
              onChange={handleVerifyChange}
              required
            />

            <button type="submit">
              Verify Passkey
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Reset Password
            </button>
          </form>
        )}

        <p>
          <Link to="/login">Back to login</Link>
        </p>
      </div>

      <Footer />
    </>
  );
}

export default Recovery;

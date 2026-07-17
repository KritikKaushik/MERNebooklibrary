import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AccessDenied() {
  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Access Denied</h2>

        <p>
          You do not have permission to view this page.
        </p>

        <Link to="/">Return Home</Link>
      </div>

      <Footer />
    </>
  );
}

export default AccessDenied;

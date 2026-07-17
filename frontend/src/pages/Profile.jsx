import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReturnButton from "../components/ReturnButton";

import {
  getProfile,
  updateProfile,
  setRecoveryPasskey as updateRecoveryPasskey,
} from "../services/authService";

import { getBorrowedBooks } from "../services/borrowService";
import { getWishlist } from "../services/wishlistService";
import WishlistButton from "../components/WishlistButton";

function Profile() {
  const [user, setUser] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const [wishlistBooks, setWishlistBooks] = useState([]);

  const [recoveryPasskey, setRecoveryPasskey] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        setUser(profile);

        setProfileForm({
          name: profile.name,
          email: profile.email,
        });

        const borrowed = await getBorrowedBooks();
        setBorrowedBooks(borrowed);

        const wishlist = await getWishlist();
        setWishlistBooks(wishlist);
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const handleRecoveryPasskey = async (e) => {
    e.preventDefault();

    try {
      const data = await updateRecoveryPasskey(recoveryPasskey);

      setRecoveryPasskey("");

      alert(data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Recovery passkey update failed"
      );
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await updateProfile(profileForm);

      setUser(updatedUser);

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: updatedUser.name,
          email: updatedUser.email,
        })
      );

      alert("Profile updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  };

  const handleWishlistChange = (bookId, isWishlisted) => {
    if (!isWishlisted) {
      setWishlistBooks(
        wishlistBooks.filter(
          (book) => book._id !== bookId
        )
      );
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const isAuthor =
    user.role === "author" 

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Welcome, {user.name}</h2>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <hr />

        <h3>Edit Profile</h3>

        <form onSubmit={handleProfileSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={profileForm.name}
            onChange={handleProfileChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profileForm.email}
            onChange={handleProfileChange}
            required
          />

          <button type="submit">
            Save Profile
          </button>
        </form>

        <hr />

        <h3>Recovery Passkey</h3>

        <form onSubmit={handleRecoveryPasskey}>
          <input
            type="password"
            placeholder="Set a recovery passkey"
            value={recoveryPasskey}
            onChange={(e) =>
              setRecoveryPasskey(e.target.value)
            }
            required
          />

          <button type="submit">
            Save Recovery Passkey
          </button>
        </form>

        <hr />

        <h3>Your Borrowed Books</h3>

        {borrowedBooks.length > 0 ? (
          <ul>
            {borrowedBooks.map((borrow) => (
              <li key={borrow._id}>
                <h4>{borrow.book?.title}</h4>

                <p>{borrow.book?.genre}</p>

                <Link to={`/book/${borrow.book?._id}`}>
                  View Book
                </Link>

                <ReturnButton
                  bookId={borrow.book?._id}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No borrowed books.</p>
        )}

        <hr />

        <h3>Your Wishlist</h3>

        {wishlistBooks.length > 0 ? (
          <ul>
            {wishlistBooks.map((book) => (
              <li key={book._id}>
                <h4>{book.title}</h4>

                <p>{book.genre}</p>

                <p>
                  Author: {book.author?.name}
                </p>

                <Link to={`/book/${book._id}`}>
                  View Book
                </Link>

                <WishlistButton
                  bookId={book._id}
                  isWishlisted={true}
                  onWishlistChange={(isWishlisted) =>
                    handleWishlistChange(
                      book._id,
                      isWishlisted
                    )
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>Your wishlist is empty.</p>
        )}

        {isAuthor && (
          <>
            <hr />

            <h3>Author Dashboard</h3>

            <p>
              Manage your books, upload new books,
              edit existing ones, and delete books
              from your dashboard.
            </p>

            <Link to="/author-dashboard">
              <button>
                Go to Author Dashboard
              </button>
            </Link>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Profile;

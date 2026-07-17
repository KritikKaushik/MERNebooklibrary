import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import DashboardCards from "../components/admin/DashboardCards";
import UserManagement from "../components/admin/UserManagement";
import BookManagement from "../components/admin/BookManagement";
import ReviewManagement from "../components/admin/ReviewManagement";

import {
  getDashboardStats,
  getUsers,
  getAdminBooks,
  getAdminReviews,
} from "../services/adminService";

function AdminPanel() {
  const [stats, setStats] = useState({
    users: 0,
    authors: 0,
    admins: 0,
    books: 0,
    activeBorrows: 0,
    reviews: 0,
  });

  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);

  const loadBooks = async () => {
    try {
      const data = await getAdminBooks();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          statsData,
          usersData,
          reviewsData,
        ] = await Promise.all([
          getDashboardStats(),
          getUsers(),
          getAdminReviews(),
        ]);

        setStats(statsData);
        setUsers(usersData);
        setReviews(reviewsData);

        await loadBooks();
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Admin Dashboard</h2>

        <DashboardCards stats={stats} />

        <UserManagement
          users={users}
          setUsers={setUsers}
          stats={stats}
          setStats={setStats}
        />

        <BookManagement
          books={books}
          refreshBooks={loadBooks}
          stats={stats}
          setStats={setStats}
        />

        <ReviewManagement
          reviews={reviews}
          setReviews={setReviews}
          stats={stats}
          setStats={setStats}
        />
      </div>

      <Footer />
    </>
  );
}

export default AdminPanel;

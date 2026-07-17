import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getBooks,
  getFeaturedBooks,
} from "../services/bookService";

function Home() {
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
  });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const allBooks = await getBooks({
          search,
          page: currentPage,
          limit: 6,
        });
        const featured = await getFeaturedBooks();

        setBooks(allBooks.books);
        setFeaturedBooks(featured);
        setPagination({
          page: allBooks.page,
          totalPages: allBooks.totalPages,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadBooks();
  }, [currentPage, search]);

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Welcome to the E-Book Library</h1>

        <p>
          Discover, borrow, and enjoy a wide variety
          of e-books from different authors.
        </p>

        <h2>Featured Books</h2>

        <div className="book-list-horizontal">
          {featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <div
                key={book._id}
                className="book-item"
              >
                {book.cover && (
                  <img
                    src={`http://localhost:8000${book.cover}`}
                    alt={book.title}
                    width="150"
                  />
                )}

                <h3>{book.title}</h3>

                <p>{book.genre}</p>

                <Link
                  to={`/book/${book._id}`}
                >
                  View Book
                </Link>
              </div>
            ))
          ) : (
            <p>No featured books found.</p>
          )}
        </div>

        <h2>Search for Books</h2>

        <input
          type="text"
          placeholder="Search by title or genre"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <h2>All Books</h2>

        <div className="book-list-horizontal">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book._id}
                className="book-item"
              >
                {book.cover && (
                  <img
                    src={`http://localhost:8000${book.cover}`}
                    alt={book.title}
                    width="150"
                  />
                )}

                <h3>{book.title}</h3>

                <p>{book.genre}</p>

                <p>
                  Author:{" "}
                  {book.author?.name ||
                    "Unknown"}
                </p>

                <Link
                  to={`/book/${book._id}`}
                >
                  View Book
                </Link>
              </div>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div>
            <button
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
              disabled={
                currentPage === pagination.totalPages
              }
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Home;

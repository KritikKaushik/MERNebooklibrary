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

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const allBooks = await getBooks();
        const featured = await getFeaturedBooks();

        setBooks(allBooks);
        setFeaturedBooks(featured);
      } catch (error) {
        console.error(error);
      }
    };

    loadBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      book.genre
        .toLowerCase()
        .includes(search.toLowerCase())
  );

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
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <h2>All Books</h2>

        <div className="book-list-horizontal">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
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
      </div>
      <Footer />
    </>
  );
}

export default Home;

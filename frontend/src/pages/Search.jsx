import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getBooks } from "../services/bookService";

function Search() {
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    featured: false,
  });

  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
  });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await getBooks({
          page: 1,
          limit: 6,
        });

        setBooks(data.books);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadBooks();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await getBooks({
        search: filters.search,
        genre: filters.genre,
        featured: filters.featured,
        page: 1,
        limit: 6,
      });

      setBooks(data.books);
      setCurrentPage(1);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = async () => {
    const emptyFilters = {
      search: "",
      genre: "",
      featured: false,
    };

    setFilters(emptyFilters);

    try {
      const data = await getBooks({
        page: 1,
        limit: 6,
      });

      setBooks(data.books);
      setCurrentPage(1);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = async (page) => {
    try {
      const data = await getBooks({
        search: filters.search,
        genre: filters.genre,
        featured: filters.featured,
        page,
        limit: 6,
      });

      setBooks(data.books);
      setCurrentPage(data.page);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Search Books</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            value={filters.search}
            placeholder="Search by title or genre"
            onChange={handleChange}
          />

          <input
            type="text"
            name="genre"
            value={filters.genre}
            placeholder="Filter by genre"
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="featured"
              checked={filters.featured}
              onChange={handleChange}
            />
            Featured books only
          </label>

          <button type="submit">
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
        </form>

        {books.length > 0 ? (
          <>
            <h2>Books Found:</h2>

            <div className="book-list-horizontal">
              {books.map((book) => (
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
                    {book.author?.name}
                  </p>

                  <Link
                    to={`/book/${book._id}`}
                  >
                    View Book
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>
            No books found.
          </p>
        )}

        {pagination.totalPages > 1 && (
          <div>
            <button
              onClick={() =>
                handlePageChange(currentPage - 1)
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
                handlePageChange(currentPage + 1)
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

export default Search;

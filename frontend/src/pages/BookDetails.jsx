import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorrowButton from "../components/BorrowButton";
import WishlistButton from "../components/WishlistButton";
import { getBookById } from "../services/bookService";
import {
  getReviews,
  addReview,
} from "../services/reviewService";
import { getWishlist } from "../services/wishlistService";

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [reviewData, setReviewData] = useState({
    review: "",
    rating: "1",
  });

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    const loadBook = async () => {
      try {
        const bookData = await getBookById(id);
        const reviewData =
          await getReviews(id);
        const isLoggedIn = !!JSON.parse(
          localStorage.getItem("user")
        );

        setBook(bookData);
        setReviews(reviewData);

        if (isLoggedIn) {
          const wishlist = await getWishlist();

          setIsWishlisted(
            wishlist.some(
              (wishlistBook) =>
                wishlistBook._id === id
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadBook();
  }, [id]);

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      await addReview({
        bookId: id,
        review: reviewData.review,
        rating: Number(
          reviewData.rating
        ),
      });

      const updatedReviews =
        await getReviews(id);

      setReviews(updatedReviews);

      setReviewData({
        review: "",
        rating: "1",
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>{book.title}</h2>

        {book.cover && (
          <img
            src={`http://localhost:8000${book.cover}`}
            alt={book.title}
            width="250"
          />
        )}

        <p>{book.content}</p>

        <p>
          Genre: {book.genre}
        </p>

        <p>
          Author:{" "}
          {book.author?.name}
        </p>

        {user && (
          <>
            <BorrowButton
              bookId={book._id}
            />

            <WishlistButton
              bookId={book._id}
              isWishlisted={isWishlisted}
              onWishlistChange={setIsWishlisted}
            />

            <h3>Reviews</h3>

            <form
              onSubmit={
                handleSubmitReview
              }
            >
              <textarea
                name="review"
                placeholder="Write your review"
                value={
                  reviewData.review
                }
                onChange={
                  handleChange
                }
                required
              />

              <select
                name="rating"
                value={
                  reviewData.rating
                }
                onChange={
                  handleChange
                }
              >
                <option value="1">
                  1
                </option>
                <option value="2">
                  2
                </option>
                <option value="3">
                  3
                </option>
                <option value="4">
                  4
                </option>
                <option value="5">
                  5
                </option>
              </select>

              <button type="submit">
                Submit Review
              </button>
            </form>
          </>
        )}

        <hr />

        <h3>All Reviews</h3>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
            >
              <strong>
                {
                  review.user
                    ?.name
                }
              </strong>

              <p>
                {
                  review.review
                }
              </p>

              <p>
                Rating:{" "}
                {
                  review.rating
                }
                /5
              </p>

              <hr />
            </div>
          ))
        ) : (
          <p>
            No reviews yet.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default BookDetails;

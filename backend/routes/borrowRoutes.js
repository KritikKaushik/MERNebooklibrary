const express = require("express");

const {
  borrowBook,
  returnBook,
  getBorrowedBooks,
} = require("../controllers/borrowController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/borrow/:bookId",
  protect,
  borrowBook
);

router.put(
  "/return/:bookId",
  protect,
  returnBook
);


router.get(
  "/borrowed",
  protect,
  getBorrowedBooks
);

module.exports = router;

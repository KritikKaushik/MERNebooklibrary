const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getFeaturedBooks,
  getBookById,
  deleteBook,
  getMyBooks,
  updateBook,
} = require("../controllers/bookController");

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/",
  protect,
  authorize("author", "admin"),
  upload.single("cover"),
  createBook
);

router.get("/", getBooks);

router.get("/featured", getFeaturedBooks);

router.get(
  "/my-books",
  protect,
  authorize("author", "admin"),
  getMyBooks
);

router.get("/:id", getBookById);

router.put(
  "/:id",
  protect,
  authorize("author", "admin"),
  upload.single("cover"),
  updateBook
);


router.delete(
  "/:id",
  protect,
  authorize("author", "admin"),
  deleteBook
);

module.exports = router;

const User = require("../models/User");
const Book = require("../models/Book");
const Review = require("../models/Review");
const Borrow = require("../models/Borrow");


// ==================== USERS ====================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================== BOOKS ====================

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteBookAdmin = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    await book.deleteOne();

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================== REVIEWS ====================

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("book", "title")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    await review.deleteOne();

    res.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==================== DASHBOARD ====================

const getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      authors,
      admins,
      books,
      activeBorrows,
      reviews,
    ] = await Promise.all([
      User.countDocuments({ role: "reader" }),
      User.countDocuments({ role: "author" }),
      User.countDocuments({ role: "admin" }),
      Book.countDocuments(),
      Borrow.countDocuments({ status: "borrowed" }),
      Review.countDocuments(),
    ]);

    res.json({
      users,
      authors,
      admins,
      books,
      activeBorrows,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


//user management


const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const updateBookAdmin = async (req, res) => {
  try {
    const { title, genre, content, featured } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title ?? book.title;
    book.genre = genre ?? book.genre;
    book.content = content ?? book.content;

    if (featured !== undefined) {
      book.featured = featured;
    }

    if (req.file) {
      book.cover = `/uploads/covers/${req.file.filename}`;
    }

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
  console.error("updateBookAdmin Error:", error);

  res.status(500).json({
    message: error.message,
  });
  }
};


module.exports = {
  getDashboardStats,

  getAllUsers,
  updateUser,
  updateBookAdmin,
  deleteUser,

  getAllBooks,
  deleteBookAdmin,

  getAllReviews,
  deleteReviewAdmin,
};

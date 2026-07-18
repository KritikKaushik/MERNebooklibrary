const Book = require("../models/Book");

// Escape user input before using it in a MongoDB regular expression.
const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// Create Book
const createBook = async (req, res) => {
  try {
    const book = await Book.create({
      title: req.body.title,
      genre: req.body.genre,
      content: req.body.content,
      featured: req.body.featured || false,
      cover: req.file
        ? `/uploads/covers/${req.file.filename}`
        : "",
      author: req.user._id,
    });

    const populatedBook = await Book.findById(book._id)
      .populate("author", "name email role");

    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Books
const getBooks = async (req, res) => {
  try {
    const {
      search,
      genre,
      featured,
      page = 1,
      limit = 6,
    } = req.query;
    const query = {};
    const currentPage = Math.max(Number(page) || 1, 1);
    const booksPerPage = Math.max(Number(limit) || 6, 1);

    if (search) {
      const escapedSearch = escapeRegex(search);

      query.$or = [
        {
          title: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          genre: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    if (genre) {
      query.genre = {
        $regex: escapeRegex(genre),
        $options: "i",
      };
    }

    if (featured === "true") {
      query.featured = true;
    }

    const totalBooks = await Book.countDocuments(query);

    // Skip the books that belong to earlier pages before limiting this page.
    const skip = (currentPage - 1) * booksPerPage;

    const books = await Book.find(query)
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(booksPerPage);

    res.json({
      books,
      page: currentPage,
      totalPages: Math.ceil(totalBooks / booksPerPage),
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Featured Books
const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({
      featured: true,
    }).populate("author", "name");

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Single Book
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author", "name email role");

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Book
// Delete Book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Only author of the book or admin
    if (
      book.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
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
// Update Book
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Only author of the book or admin can edit
    if (
      book.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    book.title = req.body.title || book.title;
    book.genre = req.body.genre || book.genre;
    book.content = req.body.content || book.content;

    if (req.file) {
      book.cover = `/uploads/covers/${req.file.filename}`;
    }

    await book.save();

    const updatedBook = await Book.findById(book._id)
      .populate("author", "name email role");

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({
      author: req.user._id,
    })
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBook,
  getBooks,
  getFeaturedBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyBooks,
};

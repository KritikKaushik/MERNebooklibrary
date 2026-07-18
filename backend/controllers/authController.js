const User = require("../models/User");
const Book = require("../models/Book");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

const generateRecoveryToken = (id) => {
  return jwt.sign(
    {
      id,
      purpose: "password-recovery",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// Register Reader
const registerUser = async (req, res) => {
  try {
    const { name, email, password, recoveryPasskey } = req.body;

    if (!recoveryPasskey) {
      return res.status(400).json({
        message: "Recovery passkey is required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRecoveryPasskey = await bcrypt.hash(
      recoveryPasskey,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      recoveryPasskey: hashedRecoveryPasskey,
      role: "reader",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    }

    res.status(401).json({
      message: "Invalid email or password",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const registerAuthor = async (req, res) => {
  try {
    const { name, email, password, recoveryPasskey } = req.body;

    if (!recoveryPasskey) {
      return res.status(400).json({
        message: "Recovery passkey is required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRecoveryPasskey = await bcrypt.hash(
      recoveryPasskey,
      10
    );

    const author = await User.create({
      name,
      email,
      password: hashedPassword,
      recoveryPasskey: hashedRecoveryPasskey,
      role: "author",
    });

    res.status(201).json({
      _id: author._id,
      name: author.name,
      email: author.email,
      role: author.role,
      token: generateToken(author._id, author.role),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Prevent a user from taking an email already owned by another account.
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist", "title genre cover author")
      .populate("wishlist.author", "name");

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Book To Wishlist
const addToWishlist = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const user = await User.findById(req.user._id);

    // A wishlist should contain each book only once.
    const isWishlisted = user.wishlist.some(
      (wishlistBook) =>
        wishlistBook.toString() === req.params.bookId
    );

    if (isWishlisted) {
      return res.status(400).json({
        message: "Book already in wishlist",
      });
    }

    user.wishlist.push(book._id);
    await user.save();

    res.status(201).json({
      message: "Book added to wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Book From Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (wishlistBook) =>
        wishlistBook.toString() !== req.params.bookId
    );

    await user.save();

    res.json({
      message: "Book removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Set Recovery Passkey
const setRecoveryPasskey = async (req, res) => {
  try {
    const { recoveryPasskey } = req.body;

    if (!recoveryPasskey) {
      return res.status(400).json({
        message: "Recovery passkey is required",
      });
    }

    const hashedRecoveryPasskey = await bcrypt.hash(
      recoveryPasskey,
      10
    );

    await User.findByIdAndUpdate(req.user._id, {
      recoveryPasskey: hashedRecoveryPasskey,
    });

    res.json({
      message: "Recovery passkey updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Recovery Passkey
const verifyRecoveryPasskey = async (req, res) => {
  try {
    const { email, recoveryPasskey } = req.body;

    if (!email || !recoveryPasskey) {
      return res.status(400).json({
        message: "Email and recovery passkey are required",
      });
    }

    const user = await User.findOne({ email }).select(
      "+recoveryPasskey"
    );

    if (
      !user ||
      !user.recoveryPasskey ||
      !(await bcrypt.compare(
        recoveryPasskey,
        user.recoveryPasskey
      ))
    ) {
      return res.status(401).json({
        message: "Invalid email or recovery passkey",
      });
    }

    res.json({
      recoveryToken: generateRecoveryToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Reset Password With Recovery Passkey
const resetPassword = async (req, res) => {
  try {
    const { recoveryToken, password } = req.body;

    if (!recoveryToken || !password) {
      return res.status(400).json({
        message: "Recovery token and new password are required",
      });
    }

    const decoded = jwt.verify(
      recoveryToken,
      process.env.JWT_SECRET
    );

    if (decoded.purpose !== "password-recovery") {
      return res.status(401).json({
        message: "Invalid recovery token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(401).json({
      message: "Recovery session expired or invalid",
    });
  }
};

module.exports = {
  registerUser,
  registerAuthor,
  loginUser,
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  setRecoveryPasskey,
  verifyRecoveryPasskey,
  resetPassword,
};

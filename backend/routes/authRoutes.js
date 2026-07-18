const express = require("express");

const {
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
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register-author", registerAuthor);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.get("/wishlist", protect, getWishlist);

router.post(
  "/wishlist/:bookId",
  protect,
  addToWishlist
);

router.delete(
  "/wishlist/:bookId",
  protect,
  removeFromWishlist
);

router.put(
  "/recovery-passkey",
  protect,
  setRecoveryPasskey
);

router.post(
  "/recover/verify",
  verifyRecoveryPasskey
);

router.put("/recover/reset", resetPassword);

module.exports = router;

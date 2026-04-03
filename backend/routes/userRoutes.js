const express = require("express");
const router = express.Router();

const {
  registerUser,
  authUser,
  updateUserProfile,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

// Customer / Admin Auth
router.post("/register", registerUser);
router.post("/login", authUser);

// Logged-in user profile update
router.put("/profile", protect, updateUserProfile);

// Admin-only user management
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
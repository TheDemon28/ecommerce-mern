const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  createSupportRequest,
  getAllSupportRequests,
  getSupportRequestById,
  resolveSupportRequest,
  deleteSupportMessage,
} = require("../controllers/supportController");

// Public create support message
router.post("/", createSupportRequest);

// Admin routes
router.get("/", protect, admin, getAllSupportRequests);

router.get("/:id", protect, admin, getSupportRequestById);

router.put("/:id/resolve", protect, admin, resolveSupportRequest);

router.delete("/:id", protect, admin, deleteSupportMessage);

module.exports = router;
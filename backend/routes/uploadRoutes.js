const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, admin, upload.single("image"), (req, res) => {
  res.json({
    imageUrl: req.file.path,
  });
});

module.exports = router;
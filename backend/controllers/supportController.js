const Support = require("../models/Support");

// 📧 CREATE SUPPORT REQUEST
exports.createSupportRequest = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const supportRequest = await Support.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json(supportRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create support request",
    });
  }
};

// 📋 GET ALL SUPPORT REQUESTS (Admin)
exports.getAllSupportRequests = async (req, res) => {
  try {
    const requests = await Support.find().sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch support requests",
    });
  }
};

// 🔍 GET SINGLE SUPPORT REQUEST
exports.getSupportRequestById = async (req, res) => {
  try {
    const request = await Support.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Support request not found",
      });
    }

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch support request",
    });
  }
};

// ✅ MARK SUPPORT REQUEST AS RESOLVED
exports.resolveSupportRequest = async (req, res) => {
  try {
    const request = await Support.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Support request not found",
      });
    }

    request.status = "Resolved";
    await request.save();

    res.json({
      message: "Support request resolved",
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to resolve support request",
    });
  }
};

// 🗑️ DELETE SUPPORT REQUEST
exports.deleteSupportMessage = async (req, res) => {
  try {
    const request = await Support.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Support request not found",
      });
    }

    await request.deleteOne();

    res.json({
      message: "Support request deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete support request",
    });
  }
};
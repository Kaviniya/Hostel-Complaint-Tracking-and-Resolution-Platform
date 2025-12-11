const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const jwt = require("jsonwebtoken");

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get complaints
router.get("/", auth, async (req, res) => {
  try {
    const query = req.user.role === "warden" ? {} : { user: req.user.id };
    const complaints = await Complaint.find(query).populate("user", "name email").sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add complaint
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });
  try {
    const { title, description } = req.body;
    const complaint = new Complaint({ title, description, user: req.user.id });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update status
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "warden") return res.status(403).json({ message: "Access denied" });
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

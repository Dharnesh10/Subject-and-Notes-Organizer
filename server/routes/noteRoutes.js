const express = require("express");
const authMiddleware = require("../middleware/auth");
const { Note } = require("../models/note");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

// GET all notes for a topic
router.get("/:topicId", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ topicId: req.params.topicId, userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching notes" });
  }
});

// POST new note with optional image
router.post("/:topicId", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const note = new Note({
      content: req.body.content,
      topicId: req.params.topicId,
      userId: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : "", // save path
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating note" });
  }
});

// PUT update note
router.put("/:noteId", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const updateData = { content: req.body.content };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating note" });
  }
});

// DELETE note
router.delete("/:noteId", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.noteId, userId: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting note" });
  }
});

module.exports = router;

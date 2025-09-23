const express = require("express");
const authMiddleware = require("../middleware/auth");
const { Topic } = require("../models/topic"); // create topic model
const router = express.Router();

// GET all topics for a subject
router.get("/:subjectId", authMiddleware, async (req, res) => {
  try {
    const topics = await Topic.find({
      subjectId: req.params.subjectId,
      userId: req.user.id,
    }).sort({ createdAt: -1 });
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching topics" });
  }
});

// POST new topic
router.post("/:subjectId", authMiddleware, async (req, res) => {
  try {
    const topic = new Topic({
      ...req.body,
      subjectId: req.params.subjectId,
      userId: req.user.id,
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating topic" });
  }
});

// PUT update topic
router.put("/:topicId", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.topicId, userId: req.user.id },
      { title: req.body.title },
      { new: true }
    );
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating topic" });
  }
});

// DELETE topic
router.delete("/:topicId", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({
      _id: req.params.topicId,
      userId: req.user.id,
    });
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json({ message: "Topic deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting topic" });
  }
});

module.exports = router;

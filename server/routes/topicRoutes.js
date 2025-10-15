const express = require("express");
const authMiddleware = require("../middleware/auth");
const { Topic } = require("../models/topic");
const { Note } = require("../models/note");
const router = express.Router();

/* ---------------- Public Routes ---------------- */

// GET all published topics
// GET all published topics
router.get("/public", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id; // comes from authMiddleware
    const topics = await Topic.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName")
      .lean(); // return plain objects

    const updatedTopics = topics.map((t) => ({
      ...t,
      likesCount: t.likes.length,
      savesCount: t.saves.length,
      liked: userId ? t.likes.some((id) => id.toString() === userId) : false,
      saved: userId ? t.saves.some((id) => id.toString() === userId) : false,
    }));

    res.json(updatedTopics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching public topics" });
  }
});


// GET a single published topic + notes
// GET a single published topic + notes
router.get("/public/:topicId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    const topic = await Topic.findOne({ _id: req.params.topicId, published: true })
      .populate("userId", "firstName lastName")
      .lean();

    if (!topic)
      return res.status(404).json({ error: "Topic not found or not published" });

    const notes = await Note.find({ topicId: topic._id })
      .populate("userId", "firstName lastName")
      .lean();

    const updatedTopic = {
      ...topic,
      likesCount: topic.likes.length,
      savesCount: topic.saves.length,
      liked: userId ? topic.likes.some((id) => id.toString() === userId) : false,
      saved: userId ? topic.saves.some((id) => id.toString() === userId) : false,
    };

    res.json({ topic: updatedTopic, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching public topic" });
  }
});



/* ---------------- Private Routes ---------------- */

// GET all topics saved by the user
router.get("/saved", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const topics = await Topic.find({ saves: { $in: [userId] } })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName")
      .lean();

    const updatedTopics = topics.map((t) => ({
      ...t,
      likesCount: t.likes.length,
      savesCount: t.saves.length,
      liked: t.likes.some((id) => id.toString() === userId),
      saved: true,
    }));

    res.json(updatedTopics);
  } catch (err) {
    console.error("Error fetching saved topics:", err);
    res.status(500).json({ error: "Error fetching saved topics" });
  }
});

// GET all topics liked by the user
router.get("/liked", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const topics = await Topic.find({ likes: { $in: [userId] } })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName")
      .lean();

    const updatedTopics = topics.map((t) => ({
      ...t,
      likesCount: t.likes.length,
      savesCount: t.saves.length,
      liked: true,
      saved: t.saves.some((id) => id.toString() === userId),
    }));

    res.json(updatedTopics);
  } catch (err) {
    console.error("Error fetching liked topics:", err);
    res.status(500).json({ error: "Error fetching liked topics" });
  }
});


// ⚠️ keep this one *below* the above route
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

// Publish/unpublish topic
router.put("/:topicId/publish", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.topicId, userId: req.user.id },
      { published: req.body.published },
      { new: true }
    );
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    res.json({ message: `Topic ${topic.published ? "published" : "unpublished"}`, topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating publish status" });
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

    await Note.deleteMany({ topicId: topic._id });
    res.json({ message: "Topic deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting topic" });
  }
});

// Like/unlike topic
router.put("/:topicId/like", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const userId = req.user.id;
    const alreadyLiked = topic.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      topic.likes.pull(userId); // unlike
    } else {
      topic.likes.push(userId); // like
    }

    await topic.save();
    res.json({
      likesCount: topic.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error("Error updating likes:", err);
    res.status(500).json({ error: "Error updating likes" });
  }
});


// Save/unsave topic
router.put("/:topicId/save", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const userId = req.user.id;
    const alreadySaved = topic.saves.includes(userId);

    if (alreadySaved) {
      topic.saves.pull(userId);  // unsave
    } else {
      topic.saves.push(userId);  // save
    }

    await topic.save();
    res.json({ savesCount: topic.saves.length, saved: !alreadySaved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating saves" });
  }
});


module.exports = router;

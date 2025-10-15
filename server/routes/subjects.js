const { Subject, subjectValidationSchema } = require("../models/subject");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();
const { Topic } = require("../models/topic");
const { Note } = require("../models/note");

// ------------------ SUBJECT ROUTES ------------------

// ✅ GET all subjects for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Error fetching subjects" });
  }
});

// ✅ GET one subject by ID (only if created by the user)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({ error: "Subject not found or access denied" });
    }

    res.status(200).json(subject);
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ error: "Error fetching subject" });
  }
});



// ------------------ POST a new subject ------------------
router.post("/", authMiddleware, async (req, res) => {
  const { error } = subjectValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const subject = new Subject({
      ...req.body,
      userId: req.user.id, // 👈 tie subject to logged-in user
    });

    await subject.save();
    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ error: "Error creating subject" });
  }
});

// ------------------ UPDATE a subject (only if belongs to logged-in user) ------------------
router.put("/:id", authMiddleware, async (req, res) => {
  const { subjectName, subjectContent } = req.body;

  if (!subjectName) return res.status(400).json({ error: "Subject name is required" });

  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { subjectName, subjectContent },
      { new: true }
    );

    if (!subject) return res.status(404).json({ error: "Subject not found or access denied" });

    res.status(200).json({ message: "Subject updated successfully", subject });
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ error: "Error updating subject" });
  }
});


// ------------------ DELETE a subject (only if belongs to logged-in user) ------------------
// DELETE a subject (only if belongs to logged-in user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!subject) return res.status(404).json({ error: "Subject not found or you do not have access" });

    // 1. Find topics for this subject
    const topics = await Topic.find({ subjectId: subject._id });

    // 2. Get all topic IDs
    const topicIds = topics.map((t) => t._id);

    // 3. Delete notes for all those topics
    await Note.deleteMany({ topicId: { $in: topicIds } });

    // 4. Delete the topics themselves
    await Topic.deleteMany({ subjectId: subject._id });

    res.status(200).json({ message: "Subject, topics, and notes deleted successfully" });

  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ error: "Error deleting subject" });
  }
});


module.exports = router;

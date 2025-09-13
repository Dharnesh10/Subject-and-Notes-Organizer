const { Subject, subjectValidationSchema } = require("../models/subject");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

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

// ------------------ DELETE a subject (only if belongs to logged-in user) ------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!subject) return res.status(404).json({ error: "Subject not found or you do not have access" });

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ error: "Error deleting subject" });
  }
});

module.exports = router;

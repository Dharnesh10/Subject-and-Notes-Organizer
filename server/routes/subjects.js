const { Subject } = require('../models/subject');
const { subjectValidationSchema } = require('../models/subject');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

// ------------------ GET all subjects ------------------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Error fetching subjects" });
  }
});

// ------------------ POST a new subject ------------------
router.post('/', authMiddleware, async (req, res) => {
  // Validate request body
  const { error } = subjectValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({
      message: 'Subject created successfully',
      subject,
    });
  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ error: 'Error creating subject' });
  }
});

// ------------------ DELETE a subject ------------------
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ error: 'Error deleting subject' });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: "" }, // Store image path or URL
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };

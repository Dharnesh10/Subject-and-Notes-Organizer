const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],   // users who liked
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],   // users who saved
  },
  { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);

module.exports = { Topic };

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Title is required"],
    minlength: 4,
    maxlength: 200,
  },
  content: {
    type: String,
    trim: true,
    required: [true, "Content is required"],
    minlength: 4,
    maxlength: 5000,
  },
  photo: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  update: Date,
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    },
  ],
});

export const Post = mongoose.model("Post", PostSchema);

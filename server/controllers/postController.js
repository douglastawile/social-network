import multer from "multer";
import sharp from "sharp";

import { Post } from "../models/PostModel.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(res.status(401).json({ error: "Please upload only images." }), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPostPhoto = upload.single("photo");

export const resizePostPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.post?._id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/posts/${req.file.filename}`);

  next();
};

//GET POST BY ID
export const postByID = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    req.post = post;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Create a new post and save to the database
export const createPost = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(422).json({ error: "All fields are required." });
  }

  const post = new Post({ title, content });
  post.postedBy = req.profile;
  try {
    if (req.file) post.photo = req.file.filename;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//Getting all the post from the database
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//Get single post by the Id
export const getPost = async (req, res) => {
  try {
    const post = req.post;
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//Checking if the creator is the authenticated and authorized
export const isPoster = (req, res, next) => {
  const isAuthorized =
    req.post &&
    req.user &&
    req.post.postedBy._id.toString() === req.user._id.toString();
  if (!isAuthorized) {
    return res
      .status(403)
      .json({ error: "Access Denied. User not authorized." });
  }

  next();
};

//Update post and save to the database
export const updatePost = async (req, res) => {
  try {
    const post = req.post;
    post.set(req.body);
    post.updated = Date.now();
    if (req.file) post.photo = req.file.filename;

    await post.save();
    res.status(200).json({
      status: "Success",
      message: "Post updated success",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//Deleting a post from the server
export const deletePost = async (req, res) => {
  try {
    const post = req.post;
    await Post.findByIdAndDelete({ _id: post._id });
    res.status(200).json({
      status: "Success",
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

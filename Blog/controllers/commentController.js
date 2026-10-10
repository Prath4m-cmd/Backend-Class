
const Comment = require("../models/Comment");
const Post = require("../models/Post");
require("../models/User");
const TEST_USER_ID = "6ac9cfd2ffeec4f527c2ca95";

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = TEST_USER_ID;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      post: id,
      author: userId,
      content: content.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name");

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message,
    });
  }
};

// Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: id })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve comments",
      error: error.message,
    });
  }
};

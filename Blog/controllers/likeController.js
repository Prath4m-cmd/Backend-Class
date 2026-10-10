
const Post = require("../models/Post");
const TEST_USER_ID = "6ac9cfd2ffeec4f527c2ca95";

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = TEST_USER_ID;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      likesCount: updatedPost.likes.length,
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to like post",
      error: error.message,
    });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = TEST_USER_ID;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      likesCount: updatedPost.likes.length,
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to unlike post",
      error: error.message,
    });
  }
};

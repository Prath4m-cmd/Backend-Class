
const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
} = require("../controllers/postController");

router.post("/create", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);

module.exports = router;

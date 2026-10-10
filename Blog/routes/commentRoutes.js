
const express = require("express");
const router = express.Router();

const {
  createComment,
  getComments,
} = require("../controllers/commentController");

router.post("/:id/comments/create", createComment);
router.get("/:id/comments", getComments);

module.exports = router;

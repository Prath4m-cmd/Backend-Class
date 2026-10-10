
const express = require("express");
const router = express.Router();

const {
  likePost,
  unlikePost,
} = require("../controllers/likeController");

router.post("/:id/likes/like", likePost);
router.delete("/:id/likes/unlike", unlikePost);

module.exports = router;

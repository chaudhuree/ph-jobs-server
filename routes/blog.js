const express = require("express");

const router = express.Router();

const {
  createBlog,
  getBlogs,
  getBlog,
} = require("../controllers/blogController.js");

router.route("/blogs").get(getBlogs).post(createBlog);
router.route("/blogs/:id").get(getBlog);

module.exports = router;
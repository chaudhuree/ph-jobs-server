const Blog = require("../models/Blog");

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({success:true,blog});
  } catch (error) {
    res.status(500).json({ success:false,message: error.message});
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ success:true, blogs} );
  } catch (error) {
    res.status(500).json({ success:false, message: error.message});
  }
};

// Get a single blog
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json({ success:true, blog });
  } catch (error) {
    res.status(500).json({ success:false, message: error.message});
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
};
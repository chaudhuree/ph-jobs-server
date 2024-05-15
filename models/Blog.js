const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
    },
    banner: {
      type: String,
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Blog", BlogSchema);

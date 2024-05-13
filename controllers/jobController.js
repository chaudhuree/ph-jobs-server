const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Jobs");
const User = require("../models/User");
/*
 {
    bannerURL: {
      type: String,
    },

    jobTitle: {
      type: String,
    },
    company: {
      type: String,
    },

    recruiterName: {
      type: String,
    },
    recruiterEmail: {
      type: String,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      enum: ["On Site", "Part Time", "Remote", "Hybrid"],
      default: "On Site",
    },
    jobType: {
      type: String,
      enum: ["Intern", "Intermediate", "Senior", "Advocate"],
      default: "Intermediate",
    },
    jobDescription: {
      type: String,
    },
    jobLocation: {
      type: String,
    },
    salaryRange: {
      type: String,
    },
    jobPostDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    applicants: {
      type: Number,
      default: 0,
    },
*/
// create job
const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, recruiter: req.user });
    res
      .status(StatusCodes.CREATED)
      .json({ sussess: true, message: "job created", job });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

module.exports = { createJob };
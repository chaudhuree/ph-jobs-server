const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
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
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Job", JobSchema);

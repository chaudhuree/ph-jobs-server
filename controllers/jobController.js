const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Jobs");
const User = require("../models/User");

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
// get all jobs with pagination-> search by jobTitle,filter by category,jobType, sort by createdAt,deadline,applicants
const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      jobType,
      sortBy,
      company,
      jobLocation,
    } = req.query;
    const query = {};
    if (search) {
      query.jobTitle = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }
    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }
    if (company) {
      query.company = { $regex: company, $options: "i" };
    }
    if (jobLocation) {
      query.jobLocation = { $regex: jobLocation, $options: "i" };
    }
    let jobs;
    if (sortBy) {
      jobs = await Job.find(query)
        .sort({ [sortBy]: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({
          path: "recruiter",
          select: "displayName email photoURL",
        });
    } else {
      jobs = await Job.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({
          path: "recruiter",
          select: "displayName email photoURL",
        });
    }
    const total = await Job.countDocuments(query);
    res.status(StatusCodes.OK).json({ success: true, jobs, total });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// get single job
const getSingleJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findOne({ _id: jobId }).populate({
      path: "recruiter",
      select: "displayName email photoURL",
    });
    if (!job) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Job not found" });
    }
    res.status(StatusCodes.OK).json({ success: true, job });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// jobs by category
const getJobsByCategory = async (req, res) => {
  try {
    const { category, limit } = req.params;
    if(category === 'all'){
      const jobs = await Job.find().sort({ createdAt: -1 }).limit(limit * 1);
      return res.status(StatusCodes.OK).json({ success: true, jobs });
    }
    const jobs = await Job.find({
      category: { $regex: category, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1);
    res.status(StatusCodes.OK).json({ success: true, jobs });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// get jobs by recruiter
const getJobsByRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user });
    res.status(StatusCodes.OK).json({ success: true, jobs });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// update job
const updateJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findOneAndUpdate(
      { _id: jobId, recruiter: req.user },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!job) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Job not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Job updated", job });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// delete job
const deleteJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findOneAndDelete({ _id: jobId, recruiter: req.user });
    if (!job) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Job not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Job deleted", job });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
module.exports = {
  createJob,
  getAllJobs,
  getSingleJob,
  getJobsByCategory,
  getJobsByRecruiter,
  updateJob,
  deleteJob,
};

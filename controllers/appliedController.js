const { StatusCodes } = require("http-status-codes");
const Applied = require("../models/Applied");
const Job = require("../models/Jobs");

// create applied job
const createAppliedJob = async (req, res) => {
  try {
    const { jobId, resumeLink } = req.body;
    const job = await Job.findOne({ _id: jobId });
    if (!job) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Job not found" });
    }
    // check if user is applying to their own job
    if (job.recruiter.toString() === req.user.toString()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "You can not apply to your own job" });
    }
    // check if user already applied for the job
    const alreadyApplied = await Applied.findOne({
      job: jobId,
      user: req.user,
    });
    if (alreadyApplied) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "You have already applied for this job",
      });
    }
    // check if deadline has passed
    if (job.deadline < new Date()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "The deadline has passed" });
    }
    const applied = await Applied.create({
      job: jobId,
      user: req.user,
      resume: resumeLink,
    });
    // increment the number of applicants in the job model
    await Job.updateOne({ _id: jobId }, { $inc: { applicants: 1 } });
    res
      .status(StatusCodes.CREATED)
      .json({ sussess: true, message: "job applied", applied });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// get applied jobs by user (get all jobs applied by a logged in user)
const getAppliedJobsByUser = async (req, res) => {
  try {
    const appliedJobs = await Applied.find({ user: req.user }).populate("job");
    const totalJobs = await Applied.countDocuments({ user: req.user });
    res.status(StatusCodes.OK).json({ success: true,totalJobs, appliedJobs });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// get applied jobs by jobId (get all users that applied for a job->for recruiters)
const getAppliedUsersListForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Applied.find({ job: jobId }).populate("user");
    res.status(StatusCodes.OK).json({ success: true, applicants });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// update applied job status (accept or reject)
const updateAppliedJobStatus = async (req, res) => {
  try {
    const { appliedId } = req.params;
    const { status } = req.body;
    const applied = await Applied.findOne({ _id: appliedId });
    if (!applied) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Applied job not found" });
    }
    if (status === "Accepted" || status === "Rejected") {
      await Applied.updateOne({ _id: appliedId }, { status });
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "Status updated successfully" });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid status" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// check if user has already applied for a job or not(for frontend)
const checkAppliedStatusForAJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const alreadyApplied = await Applied.findOne({
      job: jobId,
      user: req.user,
    });
    if (alreadyApplied) {
      return res.status(StatusCodes.OK).json({ success: true, alreadyApplied: true});
    }
    res.status(StatusCodes.OK).json({ success: true, alreadyApplied: false });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
module.exports = { createAppliedJob, getAppliedJobsByUser, getAppliedUsersListForJob,checkAppliedStatusForAJob, updateAppliedJobStatus};

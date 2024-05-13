const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getSingleJob,
  getJobsByCategory,
  getJobsByRecruiter,
  updateJob,
  deleteJob,
} = require("../controllers/jobController.js");
const { requireAuth } = require("../middleware/authentication.js");

router.route("/job").post(requireAuth, createJob);
// http://localhost:3000/jobs?search=&category=&jobType=&sortBy=applicants
router.route("/jobs").get( getAllJobs);
router.route("/postedjobs").get(requireAuth, getJobsByRecruiter);
router.route("/jobs/:category").get(requireAuth, getJobsByCategory);
router
  .route("/job/:id")
  .get(requireAuth, getSingleJob)
  .put(requireAuth, updateJob)
  .delete(requireAuth, deleteJob);

module.exports = router;

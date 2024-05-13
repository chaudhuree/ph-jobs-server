const express = require("express");

const router = express.Router();

const {
  createAppliedJob,
  getAppliedJobsByUser,
  getAppliedUsersListForJob,
  updateAppliedJobStatus,
  checkAppliedStatusForAJob
} = require("../controllers/appliedController.js");

const { requireAuth } = require("../middleware/authentication.js");

router.route("/apply").post(requireAuth, createAppliedJob);
router.route("/appliedjobs").get(requireAuth, getAppliedJobsByUser);
router.route("/appliedjobs/:jobId").get(requireAuth, getAppliedUsersListForJob);
router.route("/appliedjob/:appliedId").put(requireAuth, updateAppliedJobStatus);
router.route("/checkapplied/:jobId").get(requireAuth, checkAppliedStatusForAJob);

module.exports = router;

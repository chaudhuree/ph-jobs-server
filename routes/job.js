const express = require("express");

const router = express.Router();

const { createJob,updateJob,deleteJob } = require("../controllers/jobController.js");
const { requireAuth } = require("../middleware/authentication.js");

router.route("/job").post(requireAuth, createJob);
router.route("/job/:id").put(requireAuth, updateJob).delete(requireAuth, deleteJob);

module.exports = router;
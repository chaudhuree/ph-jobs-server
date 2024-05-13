const express = require("express");

const router = express.Router();

const { createJob } = require("../controllers/jobController.js");
const { requireAuth } = require("../middleware/authentication.js");

router.route("/job").post(requireAuth, createJob);

module.exports = router;
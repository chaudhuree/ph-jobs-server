const express = require("express");

const router = express.Router();

const { fireAuth, logout,isLogin } = require("../controllers/authController.js");
const { requireAuth } = require("../middleware/authentication.js");

router.route("/auth").post(fireAuth);
router.route("/auth/logout").get(requireAuth, logout);
router.route("/auth/islogin").get(requireAuth, isLogin);

module.exports = router;

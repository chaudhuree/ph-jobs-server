const express = require("express");

const router = express.Router();

const { createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead} = require('../controllers/notificationController.js');
const { requireAuth } = require('../middleware/authentication.js');

router.route("/notification").post(requireAuth, createNotification);
router.route("/notifications").get(requireAuth, getNotificationsByUser);
router.route("/notification/:id").put(requireAuth, markNotificationAsRead);
router.route("/notifications/markallasread").put(requireAuth, markAllNotificationsAsRead);

module.exports = router;
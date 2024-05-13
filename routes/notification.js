const express = require("express");

const router = express.Router();

const { createNotification,
  getNotificationsByReadStatus,
  markNotificationAsRead,
  markAllNotificationsAsRead} = require('../controllers/notificationController.js');
const { requireAuth } = require('../middleware/authentication.js');

router.route("/notification").post(requireAuth, createNotification);
// {{baseUrl}}/api/v1/notifications?read=true
router.route("/notifications").get(requireAuth, getNotificationsByReadStatus);
router.route("/notification/:id").put(requireAuth, markNotificationAsRead);
router.route("/notifications/markallasread").put(requireAuth, markAllNotificationsAsRead);

module.exports = router;
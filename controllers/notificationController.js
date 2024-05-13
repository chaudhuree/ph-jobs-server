const { StatusCodes } = require("http-status-codes");
const Notification = require("../models/Notification");
const User = require("../models/User");

// create notification
const createNotification = async (req, res) => {
  try {
    const { user, message, link } = req.body;
    const notification = await Notification.create({
      user,
      message,
      link,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "notification created", notification });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Notification not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "notification marked as read",
        notification,
      });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

//  mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const notifications = await Notification.updateMany(
      { user: req.user },
      { read: true }
    );
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "All notifications marked as read",
        notifications,
      });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// get notification of user by read status
const getNotificationsByReadStatus = async (req, res) => {
  try {
    const { read } = req.query;
    if (read === "true") {
      const notifications = await Notification.find({
        user: req.user,
        read: true,
      });
      const totalNotifications = await Notification.countDocuments({
        user: req.user,
        read: true,
      });
      res
        .status(StatusCodes.OK)
        .json({ success: true, totalNotifications, notifications });
    } else if (read === "false") {
      const notifications = await Notification.find({
        user: req.user,
        read: false,
      });
      const totalNotifications = await Notification.countDocuments({
        user: req.user,
        read: false,
      });
      res
        .status(StatusCodes.OK)
        .json({ success: true, totalNotifications, notifications });
    } else if (read === "all") {
      const notifications = await Notification.find({ user: req.user });
      const totalNotifications = await Notification.countDocuments({
        user: req.user,
      });
      res
        .status(StatusCodes.OK)
        .json({ success: true, totalNotifications, notifications });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid query parameter" });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotificationsByReadStatus,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};

const express = require("express");
const {
  getTask,
  setTask,
  updateTask,
  deleteTask,
  requestStatusChange,
  approvedStatusChange,
} = require("../controllers/taskController");

const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(authenticate, getTask);
router.route("/create").post(authenticate, setTask);

router.post(
  "/request-status-change/:taskId",
  authenticate,
  requestStatusChange
);
router.put(
  "/approve-status-change/:taskId",
  authenticate,
  approvedStatusChange
);

router
  .route("/:id")
  .put(authenticate, updateTask)
  .delete(authenticate, deleteTask);

module.exports = router;

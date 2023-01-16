const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const router = express.Router();
const {
  loginPage,
  registerPage,
  registerUser,
  loginUser,
  forgotPage,
  forgottenUser,
  resetUser,
  resetPage,
  noteUser,
  notePage,
  commentUser,
  commentPage,
  getNotes,
  postNotes,
  renameNote,
  notePageView,
  deleteDocument
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.route("/login").get(loginPage).post(loginUser);
router.route("/register").get(registerPage).post(registerUser);
router.route("/forgot").get(forgotPage).post(forgottenUser);
router.route("/reset").get(resetPage).post(resetUser);
router.route("/note/:id").get(protect, notePage).post(protect, noteUser);
router.route("/note/view/:id").get(protect, notePageView);
router.route("/comment/view/:id").get(protect, commentPage);
router.route("/comment/:id").get(protect, commentPage).post(protect, commentUser);
router.route("/notes").get(protect, getNotes).post(protect, postNotes);
router.route("/notes/:id").post(protect, renameNote);
router.route("/document").post(protect, deleteDocument);

module.exports = router;
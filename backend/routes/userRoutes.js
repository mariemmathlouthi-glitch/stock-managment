const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/userController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Route admin: lister tous les utilisateurs (exemple) — protégée
router.get("/all", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("prenom nom email telephone role");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Test
router.get("/test", (req, res) => {
  res.json({ message: "Les routes fonctionnent !" });
});

module.exports = router;
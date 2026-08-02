const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Test
router.get("/test", (req, res) => {
  res.json({ message: "Les routes fonctionnent !" });
});

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  toggleUserStatus,
  deleteUserByAdmin
} = require("../controllers/userController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Routes publiques
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route de test
router.get("/test", (req, res) => {
  res.json({ message: "Les routes utilisateurs fonctionnent !" });
});

// Routes réservées exclusivement à l'administrateur
router.use(verifyToken, requireRole("admin"));

router.get("/", getAllUsers);
router.get("/all", getAllUsers); // alias de rétrocompatibilité
router.post("/", createUserByAdmin);
router.put("/:id", updateUserByAdmin);
router.patch("/:id/toggle-status", toggleUserStatus);
router.delete("/:id", deleteUserByAdmin);

module.exports = router;
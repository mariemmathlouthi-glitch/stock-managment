const express = require("express");
const router = express.Router();

const { getDashboardOverview } = require("../controllers/dashboardController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", (req, res) => res.json({ message: "Dashboard base route is active" }));
router.get("/overview", verifyToken, requireRole("admin"), getDashboardOverview);

module.exports = router;

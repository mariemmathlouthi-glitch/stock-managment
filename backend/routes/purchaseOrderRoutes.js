const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware");
const controller = require("../controllers/purchaseOrderController");
router.use(verifyToken); router.get("/", controller.getOrders); router.post("/", controller.createOrder); router.put("/:id", controller.updateOrder); router.patch("/:id/cancel", controller.cancelOrder);
module.exports = router;

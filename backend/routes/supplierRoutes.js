const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware");
const controller = require("../controllers/supplierController");
router.use(verifyToken); router.get("/", controller.getSuppliers); router.post("/", controller.createSupplier); router.put("/:id", controller.updateSupplier); router.delete("/:id", controller.deleteSupplier);
module.exports = router;

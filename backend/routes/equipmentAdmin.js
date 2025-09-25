import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  adminListEquipment,
  adminCreateEquipment,
  adminUpdateEquipment,
  adminDeleteEquipment,
  adminChangeEquipmentStatus,
} from "../controllers/equipmentAdminController.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", adminListEquipment);
router.post("/", adminCreateEquipment);
router.put("/:id", adminUpdateEquipment);
router.delete("/:id", adminDeleteEquipment);
router.patch("/:id/status", adminChangeEquipmentStatus);

export default router;

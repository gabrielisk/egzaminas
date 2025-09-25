import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  adminListEquipment,
  adminCreateEquipment,
} from "../controllers/equipmentAdminController.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", adminListEquipment);
router.post("/", adminCreateEquipment);

export default router;

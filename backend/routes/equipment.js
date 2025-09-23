import { Router } from "express";
import {
  listEquipment,
  getEquipmentById,
} from "../controllers/equipmentController.js";

const router = Router();

router.get("/", listEquipment);
router.get("/:id", getEquipmentById);

export default router;

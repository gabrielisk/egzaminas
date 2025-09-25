import { Router } from "express";
import {
  createReservation,
  myReservations,
  cancelMyReservation,
  updateMyReservation,
} from "../controllers/reservationController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.post("/", createReservation);
router.get("/me", myReservations);
router.delete("/:id", cancelMyReservation);
router.put("/:id", requireAuth, updateMyReservation);

export default router;

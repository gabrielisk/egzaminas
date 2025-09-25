import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  adminListReservations,
  adminChangeReservationStatus,
} from "../controllers/reservationsAdminController.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", adminListReservations);
router.patch("/:id/status", adminChangeReservationStatus);

export default router;

import express from "express";
import {
  getTxnsById,
  createVendor,
  getTxns,
  getVendorById,
  getVendors,
  verifyDeliveryUser,
  getDeliveryUsers,
} from "../controllers";

const router = express.Router();

router.post("/vendor", createVendor);
router.get("/vendors", getVendors);
router.get("/vendor/:id", getVendorById);

router.get("/txns", getTxns);
router.get("/txn/:id", getTxnsById);

router.put("/delivery/verify", verifyDeliveryUser);
router.get("/deliverys", getDeliveryUsers);

export { router as AdminRouter };

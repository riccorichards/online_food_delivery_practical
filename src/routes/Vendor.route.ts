import express from "express";
import {
  addFood,
  createOffer,
  getCurrentOrders,
  getFoods,
  getOffers,
  getOrdersDetails,
  getVendorProfile,
  processOrders,
  updateOffer,
  updateVendomCoverImage,
  updateVendorProfile,
  updateVendorService,
  vendorLogin,
} from "../controllers";
import { authenticate } from "../middlewares";
import multer from "multer";
import { uploadFileToGoogleCloud } from "../services/Storage.service";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/login", vendorLogin);

router.use(authenticate);
router.get("/profile", getVendorProfile);
router.patch("/profile", updateVendorProfile);
router.patch("/service", updateVendorService);
router.patch("/coverImage", upload.single("image"), updateVendomCoverImage);

router.post("/food", upload.single("image"), addFood);
router.get("/foods", getFoods);

router.get("/orders", getCurrentOrders);
router.put("/order/:id/process", processOrders);
router.get("/orders/:orderId", getOrdersDetails);

router.get("/offers", getOffers);
router.post("/offer", createOffer);
router.put("/offer/:id", updateOffer);

export { router as VendorRoute };

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

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", vendorLogin);

router.use(authenticate);
router.get("/profile", getVendorProfile);
router.patch("/profile", updateVendorProfile);
router.patch("/service", updateVendorService);
router.patch("/coverImage", images, updateVendomCoverImage);

router.post("/food", images, addFood);
router.get("/foods", getFoods);

router.get("/orders", getCurrentOrders);
router.put("/order/:id/process", processOrders);
router.get("/orders/:orderId", getOrdersDetails);

router.get("/offers", getOffers);
router.post("/offer", createOffer);
router.put("/offer/:id", updateOffer);

export { router as VendorRoute };

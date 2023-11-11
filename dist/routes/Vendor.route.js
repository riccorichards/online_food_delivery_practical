"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", controllers_1.vendorLogin);
router.use(middlewares_1.authenticate);
router.get("/profile", controllers_1.getVendorProfile);
router.patch("/profile", controllers_1.updateVendorProfile);
router.patch("/service", controllers_1.updateVendorService);
router.patch("/coverImage", images, controllers_1.updateVendomCoverImage);
router.post("/food", images, controllers_1.addFood);
router.get("/foods", controllers_1.getFoods);
router.get("/orders", controllers_1.getCurrentOrders);
router.put("/order/:id/process", controllers_1.processOrders);
router.get("/orders/:orderId", controllers_1.getOrdersDetails);
router.get("/offers", controllers_1.getOffers);
router.post("/offer", controllers_1.createOffer);
router.put("/offer/:id", controllers_1.updateOffer);
//# sourceMappingURL=Vendor.route.js.map
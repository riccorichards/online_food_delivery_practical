"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRouter = router;
router.post("/vendor", controllers_1.createVendor);
router.get("/vendors", controllers_1.getVendors);
router.get("/vendor/:id", controllers_1.getVendorById);
router.get("/txns", controllers_1.getTxns);
router.get("/txn/:id", controllers_1.getTxnsById);
router.put("/delivery/verify", controllers_1.verifyDeliveryUser);
router.get("/deliverys", controllers_1.getDeliveryUsers);
//# sourceMappingURL=Admin.route.js.map
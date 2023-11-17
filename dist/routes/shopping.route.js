"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShppongRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShppongRouter = router;
/*-------------------------- -Top Restaurant---------------------------------- */
router.get("/top-restaurant", controllers_1.getTopRestaurant);
/*-------------------------- Food filtered----------------------------------- */
router.get("/filtered-foods", controllers_1.getFilteredFood);
/*-------------------------- Food filtered----------------------------------- */
router.get("/available-foods", controllers_1.getAllFoods);
/*-------------------------- Foods Available in 30 min----------------------------------- */
router.get("/foods-in-30-min/", controllers_1.getFoodIn30Min);
router.get("/offers/:pincode", controllers_1.findAvailableOffers);
/*-------------------------- Find Restaurant by id----------------------------------- */
router.get("/restaurant/:id", controllers_1.getRestaurantById);
//# sourceMappingURL=shopping.route.js.map
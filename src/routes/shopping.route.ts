import express from "express";
import {
  getFoodAvailability,
  getFoodIn30Min,
  getRestaurantById,
  getTopRestaurant,
  searchFoods,
} from "../controllers";

const router = express.Router();

/*-------------------------- Food availability----------------------------------- */
router.get("/:pincode", getFoodAvailability);
/*-------------------------- -Top Restaurant---------------------------------- */
router.get("/top-restoraunt/:pincode", getTopRestaurant);
/*-------------------------- Foods Available in 30 min----------------------------------- */
router.get("/foods-in-30-min/:pincode", getFoodIn30Min);
/*-------------------------- Search Foods----------------------------------- */
router.get("/search/:pincode", searchFoods);
/*-------------------------- Find Restaurant by id----------------------------------- */
router.get("/restaurant/:id", getRestaurantById);

export { router as ShppongRouter };

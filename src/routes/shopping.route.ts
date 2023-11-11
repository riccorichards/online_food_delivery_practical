import express from "express";
import {
  findAvailableOffers,
  getFoodAvailability,
  getFoodIn30Min,
  getRestaurantById,
  getTopRestaurant,
  searchFoods,
} from "../controllers";

const router = express.Router();

/*-------------------------- -Top Restaurant---------------------------------- */
router.get("/top-restaurant", getTopRestaurant);
/*-------------------------- Food availability----------------------------------- */
router.get("/:pincode", getFoodAvailability);
/*-------------------------- Foods Available in 30 min----------------------------------- */
router.get("/foods-in-30-min/", getFoodIn30Min);
/*-------------------------- Search Foods----------------------------------- */
router.get("/search/:pincode", searchFoods);

router.get("/offers/:pincode", findAvailableOffers);
/*-------------------------- Find Restaurant by id----------------------------------- */
router.get("/restaurant/:id", getRestaurantById);

export { router as ShppongRouter };

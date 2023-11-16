import express from "express";
import {
  findAvailableOffers,
  getAllFoods,
  getFilteredFood,
  getFoodIn30Min,
  getRestaurantById,
  getTopRestaurant,
} from "../controllers";

const router = express.Router();

/*-------------------------- -Top Restaurant---------------------------------- */
router.get("/top-restaurant", getTopRestaurant);
/*-------------------------- Food filtered----------------------------------- */
router.get("/filtered-foods", getFilteredFood);
/*-------------------------- Food filtered----------------------------------- */
router.get("/available-foods", getAllFoods);
/*-------------------------- Foods Available in 30 min----------------------------------- */
router.get("/foods-in-30-min/", getFoodIn30Min);

router.get("/offers/:pincode", findAvailableOffers);
/*-------------------------- Find Restaurant by id----------------------------------- */
router.get("/restaurant/:id", getRestaurantById);

export { router as ShppongRouter };

import express, { Application } from "express";
import {
  AdminRouter,
  VendorRoute,
  ShppongRouter,
  CustomerRouter,
} from "../routes";
import { DeliveryRoute } from "../routes/delivery.route";
import cors from "cors";

export default (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "https://demo-online-food-delivery-client.vercel.app",
      credentials: true,
    })
  );

  app.get("/check-healthy", async (req, res) => {
    return res.status(200).json("Hello");
  });

  app.use("/admin", AdminRouter);
  app.use("/vendor", VendorRoute);
  app.use("/customer", CustomerRouter);
  app.use("/delivery", DeliveryRoute);
  app.use(ShppongRouter);

  return app;
};

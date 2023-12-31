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
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["post", "get", "put", "delete"],
    })
  );
  app.use("/admin", AdminRouter);
  app.use("/vendor", VendorRoute);
  app.use("/customer", CustomerRouter);
  app.use("/delivery", DeliveryRoute);
  app.use(ShppongRouter);

  return app;
};

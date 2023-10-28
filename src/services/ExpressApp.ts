import express, { Application } from "express";
import {
  AdminRouter,
  VendorRoute,
  ShppongRouter,
  CustomerRouter,
} from "../routes";
import path from "path";

export default (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/admin", AdminRouter);
  app.use("/vendor", VendorRoute);
  app.use("/customer", CustomerRouter);
  app.use(ShppongRouter);

  app.use("/images", express.static(path.join(__dirname, "images")));

  return app;
};

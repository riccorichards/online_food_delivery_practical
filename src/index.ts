import App from "./services/ExpressApp";
import express from "express";
import Database from "./services/Database";
import { PORT } from "./config";

const startServer = async () => {
  const app = express();
  App(app);
  Database();
  
  //app.use((error, req, res, next) => {
  //  if (error instanceof multer.MulterError) {
  //    if (error.code === "LIMIT_FILE_SIZE") {
  //      return res.status(400).json({
  //        message: "file is too large",
  //      });
  //    }

  //    if (error.code === "LIMIT_FILE_COUNT") {
  //      return res.status(400).json({
  //        message: "File limit reached",
  //      });
  //    }

  //    if (error.code === "LIMIT_UNEXPECTED_FILE") {
  //      return res.status(400).json({
  //        message: "File must be an image",
  //      });
  //    }
  //  }
  //});

  app.listen(PORT, () => {
    console.log(`We are running at ${PORT}`);
  });
};

startServer();

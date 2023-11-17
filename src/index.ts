import App from "./services/ExpressApp";
import express from "express";
import Database from "./services/Database";
import { PORT } from "./config";

const startServer = async () => {
  const app = express();
  App(app);
  Database();
  
  
  app.listen(PORT, () => {
    console.log(`We are running at ${PORT}`);
  });
};

startServer();

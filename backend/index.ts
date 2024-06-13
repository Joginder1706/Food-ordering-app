import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
const startServer = async () => {
  const app = express();

  await dbConnection();
  await App(app);

  app.listen(8000, () => {
    console.clear();
    console.log("server is running in port 8000");
  });
};
startServer();

import express from "express";
import { AppDataSource } from "./config/data-source";
import productRoute from "./route/Product";
import categoryRoute from "./route/Category"

const app = express();
app.use(express.json());
app.use("/api", productRoute);
app.use("/api",categoryRoute);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully!");

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1);
  }
};


startServer();

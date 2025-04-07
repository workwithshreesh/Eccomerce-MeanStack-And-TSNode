import express from "express";
import { AppDataSource } from "./config/data-source";
import productRoute from "./route/Product";
import categoryRoute from "./route/Category"
import cartProduct from "./route/Cart";
import userRoute from "./route/users";
import shipingAddressRoute from "./route/shipingAddress";
import orderRoutes from "./route/order";
import paymentRoutes from "./route/order";
import axios from 'axios'
import cors from "cors";
import path from "path";



const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: true }));


app.use(cors()); 

app.use("/api", productRoute);
app.use("/api",categoryRoute);
app.use("/api",cartProduct);
app.use("/api",userRoute);
app.use("/api",shipingAddressRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);



const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully!");

    const port = 4000;
    const host = "192.168.96.1";
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1);
  }
};


startServer();

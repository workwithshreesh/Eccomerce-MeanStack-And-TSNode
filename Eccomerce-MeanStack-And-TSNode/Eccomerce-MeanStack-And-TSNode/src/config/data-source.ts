import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../models/Product"; // Check if correct path
import { Category } from "../models/Category";
import { ProductImage } from "../models/ProductImage";
import { ShippingAddress } from "../models/ShipingAddress";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { ReviewRating } from "../models/ReviewRatings";
import { User } from "../models/User";
import { CartItem } from "../models/CartItem";
import { OrderItem } from "../models/OrderItem";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST, 
  port: parseInt(process.env.DB_PORT || '5432'), 
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,

  // ssl: {
  //   rejectUnauthorized: process.env.DB_SSL, 
  // },
  entities: [
             Product, Category, ProductImage, Cart, 
             Order, Payment, ShippingAddress, 
             ReviewRating, User, CartItem, OrderItem
]
});




export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization", error);
    process.exit(1); 
  }
};

import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../models/Product"; // Check if correct path
import { Category } from "../models/Category";
import { ProductImage } from "../models/ProductImage";
import { ShipingAddress } from "../models/ShipingAddress";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { ReviewRating } from "../models/ReviewRatings";
import { User } from "../models/User";
import { CartItem } from "../models/CartItem";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost", 
  port: 5432, 
  username: "postgres",
  password: "root",
  database: "ecommerce_db",
  synchronize: true,
  logging: true,
  // ssl: {
  //   rejectUnauthorized: false, 
  // },
  entities: [
             Product, Category, ProductImage, Cart, 
             Order, Payment, ShipingAddress, 
             ReviewRating, User, CartItem
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

import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../models/Product"; // Check if correct path
import { Category } from "../models/Category";
import { ProductImage } from "../models/ProductImage";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost", 
  port: 5432, 
  username: "postgres",
  password: "root",
  database: "postgres",
  synchronize: false,
  logging: false,
  // ssl: {
  //   rejectUnauthorized: false, 
  // },
  entities: [Product, Category, ProductImage],
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

import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../models/Product"; // Check if correct path
import { Category } from "../models/Category";
import { ProductImage } from "../models/ProductImage";
export const AppDataSource = new DataSource({
  type: "mysql",  
  host: "localhost",  
  port: 3306,  
  username: "root", 
  password: "pass",  
  database: "ecommerce_db",  
  synchronize: true,
  logging: true,
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

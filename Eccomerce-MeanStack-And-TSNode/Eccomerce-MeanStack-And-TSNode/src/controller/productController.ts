import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../models/Product";
import { ProductImage } from "../models/ProductImage";
import { plainToClass } from "class-transformer";
import { User } from "../models/User";
import { Category } from "../models/Category";

class ProductController {

    static async createProduct(req: Request, res: Response) {
        try {
          const { sku, name, price, categoryId, sellerId, stock } = req.body;
          console.log(req.body)

          const numStock = Number(stock)

    
          if (!sku || !name || !price || !categoryId || !sellerId || !stock) {
            return res.status(400).json({ error: "All fields (sku, name, price, categoryId, sellerId) are required" });
          }
    
          const existingProduct = await AppDataSource.manager.findOne(Product, {
            where: { sku },
          });
          if (existingProduct) {
            return res.status(409).json({ error: "SKU already exists" });
          }
    
          const category = await AppDataSource.manager.findOne(Category, { where: { id: categoryId } });
          if (!category) {
            return res.status(400).json({ error: "Invalid category ID" });
          }
    
          const seller = await AppDataSource.manager.findOne(User, { where: { id: sellerId } });
          if (!seller) {
            return res.status(400).json({ error: "Invalid seller ID" });
          }
    
          const product = new Product();
          product.sku = sku;
          product.name = name;
          product.price = parseFloat(price);
          product.category = category;
          product.seller = seller;
          product.stock = numStock;
    
          const files = req.files as Express.Multer.File[];
          if (files && files.length > 0) {
            product.images = files.map((file) => {
              const image = new ProductImage();
              image.url = file.filename;
              image.product = product;
              return image;
            });
          }
    
          await AppDataSource.manager.save(product);
    
          const plainProduct = plainToClass(Product, product);
          res.status(201).json({
            message: "Product created successfully",
            product: plainProduct,
          });
        } catch (error) {
          console.error("Error creating product:", error);
          res.status(500).json({ error: "Error creating product" });
        }
      }
    
      static async getProducts(req: Request, res: Response) {
        try {
          const products = await AppDataSource.manager.find(Product, {
            relations: ["images", "category", "seller"],
          });
          res.status(200).json(products);
        } catch (error) {
          console.error("Error fetching products:", error);
          res.status(500).json({ error: "Error fetching products" });
        }
      }
    
      static async getProductById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
          const product = await AppDataSource.manager.findOne(Product, {
            where: { id },
            relations: ["images", "category", "seller"],
          });
    
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
    
          res.status(200).json(product);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error fetching product" });
        }
      }
    
      static async updateProduct(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const { sku, name, price, categoryId, sellerId, stock } = req.body;

        const numStock = Number(stock)
    
        try {
          const product = await AppDataSource.manager.findOne(Product, {
            where: { id },
            relations: ["images", "category", "seller"],
          });
    
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
    
          if (sku) product.sku = sku;
          if (name) product.name = name;
          if (price) product.price = parseFloat(price);
          if (stock) product.stock = numStock
    
          if (categoryId) {
            const category = await AppDataSource.manager.findOne(Category, { where: { id: categoryId } });
            if (!category) {
              return res.status(400).json({ message: "Invalid category ID" });
            }
            product.category = category;
          }
    
          if (sellerId) {
            const seller = await AppDataSource.manager.findOne(User, { where: { id: sellerId } });
            if (!seller) {
              return res.status(400).json({ message: "Invalid seller ID" });
            }
            product.seller = seller;
          }
    
          const files = req.files as Express.Multer.File[];
          if (files && files.length > 0) {
            await AppDataSource.manager.remove(ProductImage, product.images);
    
            product.images = files.map((file) => {
              const image = new ProductImage();
              image.url = file.filename;
              image.product = product;
              return image;
            });
          }
    
          await AppDataSource.manager.save(product);
    
          const plainProduct = plainToClass(Product, product);
          res.status(200).json({
            message: "Product updated successfully",
            product: plainProduct,
          });
        } catch (error) {
          console.error("Error updating product:", error);
          res.status(500).json({ message: "Error updating product" });
        }
      }
    
      static async deleteProduct(req: Request, res: Response) {
        const id = parseInt(req.params.id);
    
        try {
          const product = await AppDataSource.manager.findOne(Product, {
            where: { id },
            relations: ["images"],
          });
    
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
    
          await AppDataSource.manager.remove(ProductImage, product.images);
          await AppDataSource.manager.remove(product);
    
          res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error deleting product" });
        }
      }
    }

export default ProductController;
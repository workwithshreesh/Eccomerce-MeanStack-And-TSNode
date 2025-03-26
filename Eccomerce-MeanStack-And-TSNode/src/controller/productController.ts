import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../models/Product";
import { ProductImage } from "../models/ProductImage";
import fs from "fs";
import path from "path";

class ProductController {
    
    static async createProduct(req: Request, res: Response) {
        try {
            const { sku, name, price } = req.body;
            const files = req.files as Express.Multer.File[];

            const productRepo = AppDataSource.getRepository(Product);
            const imageRepo = AppDataSource.getRepository(ProductImage);

            // Create and save product
            const product = new Product();
            product.sku = sku;
            product.name = name;
            product.price = price;

            await productRepo.save(product);

            // Save images if available
            if (files && files.length > 0) {
                const images = files.map((file) => {
                    const img = new ProductImage();
                    img.url = `/uploads/${file.filename}`;
                    img.product = product;
                    return img;
                });

                await imageRepo.save(images);
            }

            res.status(201).json({ message: "Product added successfully!", product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creating product" });
        }
    }

    static async getProducts(req: Request, res: Response) {
        try {
            const productRepo = AppDataSource.getRepository(Product);
            const products = await productRepo.find({ relations: ["images"] });

            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching products" });
        }
    }

    static async getProductsById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const productRepo = AppDataSource.getRepository(Product);

            const product = await productRepo.findOne({ where: { id }, relations: ["images"] });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching product" });
        }
    }

    static async updateProductsById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { sku, name, price } = req.body;
            const files = req.files as Express.Multer.File[];

            const productRepo = AppDataSource.getRepository(Product);
            const imageRepo = AppDataSource.getRepository(ProductImage);

            const product = await productRepo.findOne({ where: { id }, relations: ["images"] });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Update product details
            product.sku = sku;
            product.name = name;
            product.price = price;
            await productRepo.save(product);

            // Handle new image uploads
            if (files && files.length > 0) {
                // Remove old images
                await imageRepo.delete({ product: { id } });

                // Save new images
                const newImages = files.map((file) => {
                    const img = new ProductImage();
                    img.url = `/uploads/${file.filename}`;
                    img.product = product;
                    return img;
                });

                await imageRepo.save(newImages);
            }

            res.status(200).json({ message: "Product updated successfully", product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating product" });
        }
    }

    static async deleteProductsById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const productRepo = AppDataSource.getRepository(Product);
            const imageRepo = AppDataSource.getRepository(ProductImage);

            const product = await productRepo.findOne({ where: { id }, relations: ["images"] });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Delete associated images from the file system
            for (const image of product.images) {
                const imagePath = path.join(__dirname, "..", "uploads", path.basename(image.url)); // Ensure correct path
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath); // Delete the image file
                }
            }

            // Delete associated images from the database
            await imageRepo.delete({ product: { id } });

            // Delete product
            await productRepo.remove(product);

            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting product" });
        }
    }

}

export default ProductController;

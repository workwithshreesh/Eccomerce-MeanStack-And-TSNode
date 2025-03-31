import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../models/Product";
import { ProductImage } from "../models/ProductImage";
import { Category } from "../models/Category"; 
import fs from "fs";
import path from "path";

class ProductController {
    
    static async createProduct(req: Request, res: Response) {
        try {
            const { sku, name, price, categoryId } = req.body;
            const files = req.files as Express.Multer.File[];
            if (!sku || !name || !price || !categoryId) {
                return res.status(400).json({ error: "All fields (sku, name, price, categoryId) are required" });
            }

            const numericPrice = parseFloat(price);
            if (isNaN(numericPrice) || numericPrice < 0) {
                return res.status(400).json({ error: "Invalid price value" });
            }

            const productRepo = AppDataSource.getRepository(Product);
            const categoryRepo = AppDataSource.getRepository(Category);
            const imageRepo = AppDataSource.getRepository(ProductImage);

            // Validate category
            const category = await categoryRepo.findOne({ where: { id: categoryId } });
            if (!category) {
                return res.status(400).json({ error: "Invalid category ID" });
            }

            // Create product
            const product = new Product();
            product.sku = sku;
            product.name = name;
            product.price = numericPrice;
            product.category = category;

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
            const products = await productRepo.find({ relations: ["images", "category"] });

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

            const product = await productRepo.findOne({ where: { id }, relations: ["images", "category"] });

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
            const { sku, name, price, categoryId } = req.body;
            const files = req.files as Express.Multer.File[];

            const productRepo = AppDataSource.getRepository(Product);
            const categoryRepo = AppDataSource.getRepository(Category);
            const imageRepo = AppDataSource.getRepository(ProductImage);


            const product = await productRepo.findOne({ where: { id }, relations: ["images"] });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            
            if (categoryId) {
                const category = await categoryRepo.findOne({ where: { id: categoryId } });
                if (!category) {
                    return res.status(400).json({ message: "Invalid category ID" });
                }
                product.category = category;
            }

            // Update product details
            product.sku = sku;
            product.name = name;
            if (price) {
                const numericPrice = parseFloat(price);
                if (isNaN(numericPrice) || numericPrice < 0) {
                    return res.status(400).json({ error: "Invalid price value" });
                }
                product.price = numericPrice;
            }
            await productRepo.save(product);

            // Handle new image uploads
            if (files && files.length > 0) {
                for (const image of product.images) {
                    const imagePath = path.join(process.cwd(), "uploads", path.basename(image.url)); 
                    console.log("imagePath",imagePath)
                    if (fs.existsSync(imagePath)) {
                        try {
                            const unlinkS = fs.unlinkSync(imagePath); 
                            console.log("unlinks",unlinkS)
                        } catch (error) {
                            console.error("Failed to delete:", imagePath, error);
                        }
                    } else {
                        console.warn("File not found:", imagePath);
                    }
                }
                
               const imagedel = await imageRepo.delete({ product: product });
               console.log("delete",imagedel)               

                const newImages = files.map((file) => {
                    const img = new ProductImage();
                    img.url = `/uploads/${file.filename}`;
                    img.product = product;
                    return img;
                });
                console.log(newImages)

                await imageRepo.save(newImages);
            }
            console.log("shreesh")
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

            for (const image of product.images) {
                const imagePath = path.join(__dirname, "..", "uploads", path.basename(image.url));
                console.log("image",imagePath)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath); 
                }
            }
            await imageRepo.delete({ product: product });
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

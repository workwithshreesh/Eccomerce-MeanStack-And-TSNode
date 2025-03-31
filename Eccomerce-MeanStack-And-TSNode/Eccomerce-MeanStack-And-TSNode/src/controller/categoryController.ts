import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Category } from "../models/Category";

class CategoryController {
    
    static async createCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Category name is required" });
            }

            const categoryRepo = AppDataSource.getRepository(Category);
            
            // Create new category
            const category = new Category();
            category.name = name;

            await categoryRepo.save(category);

            res.status(201).json({ message: "Category created successfully!", category });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creating category" });
        }
    }

    static async getCategories(req: Request, res: Response) {
        try {
            const categoryRepo = AppDataSource.getRepository(Category);
            const categories = await categoryRepo.find();

            res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching categories" });
        }
    }

    static async getCategoryById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const categoryRepo = AppDataSource.getRepository(Category);

            const category = await categoryRepo.findOne({ where: { id } });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching category" });
        }
    }

    static async updateCategoryById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { name } = req.body;

            const categoryRepo = AppDataSource.getRepository(Category);
            const category = await categoryRepo.findOne({ where: { id } });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            category.name = name || category.name;

            await categoryRepo.save(category);

            res.status(200).json({ message: "Category updated successfully", category });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating category" });
        }
    }

    static async deleteCategoryById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const categoryRepo = AppDataSource.getRepository(Category);

            const category = await categoryRepo.findOne({ where: { id } });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await categoryRepo.remove(category);

            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting category" });
        }
    }
}

export default CategoryController;

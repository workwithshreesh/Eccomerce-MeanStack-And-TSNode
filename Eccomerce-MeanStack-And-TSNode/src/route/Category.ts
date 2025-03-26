import express from "express";
import CategoryController from "../controller/categoryController";

const router = express.Router();

router.post("/category", async (req, res) => {
    await CategoryController.createCategory(req, res);
});

router.get("/category", async (req, res) => {
    await CategoryController.getCategories(req, res);
});

router.get("/category/:id", async (req, res) => {
    await CategoryController.getCategoryById(req, res);
});

router.put("/category/:id", async (req, res) => {
    await CategoryController.updateCategoryById(req, res);
});

router.delete("/category/:id", async (req, res) => {
    await CategoryController.deleteCategoryById(req, res);
});

export default router;

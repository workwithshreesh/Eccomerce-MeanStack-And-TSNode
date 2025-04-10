import express from "express";
import ProductController from "../controller/productController"
import upload from "../middlewares/uploadMiddleware"; 
import { authMiddleWare } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/product", authMiddleWare, upload.array("images", 5), async (req, res) => {
    await ProductController.createProduct(req, res);
});

router.get("/product", async (req, res) => {
    await ProductController.getProducts(req, res);
});

router.get("/product/:id", async (req, res) => {
    await ProductController.getProductById(req, res);
});

router.put("/product/:id",authMiddleWare,upload.array("images", 5), async (req, res) => {
    await ProductController.updateProduct(req, res);
});

router.delete("/product/:id",authMiddleWare, async (req, res) => {
    await ProductController.deleteProduct(req, res);
});

export default router;

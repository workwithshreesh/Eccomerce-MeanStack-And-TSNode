import express from "express";
import ProductController from "../controller/productController"
import upload from "../middlewares/uploadMiddleware"; 

const router = express.Router();

router.post("/product",upload.array("images", 5), async (req, res) => {
    await ProductController.createProduct(req, res);
});

router.get("/product", async (req, res) => {
    await ProductController.getProducts(req, res);
});

router.get("/product/:id", async (req, res) => {
    await ProductController.getProductsById(req, res);
});

router.put("/product/:id",upload.array("images", 5), async (req, res) => {
    await ProductController.updateProductsById(req, res);
});

router.delete("/product/:id", async (req, res) => {
    await ProductController.deleteProductsById(req, res);
});

export default router;

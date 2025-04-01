import express from "express";
import CartController  from "../controller/cartController";


const router = express.Router();
const cartController = new CartController()

router.get("/cart/:userId", async (req,res) => {
    await cartController.getCart(req,res);
});

router.post("/cart", async (req,res) => {
    await cartController.addItem(req,res);
});


export default router;
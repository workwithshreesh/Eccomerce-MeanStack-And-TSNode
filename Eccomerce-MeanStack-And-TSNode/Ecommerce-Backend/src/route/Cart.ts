import express from "express";
import CartController  from "../controller/cartController";
import { authMiddleWare } from "../middlewares/authMiddleware";


const router = express.Router();
const cartController = new CartController()

router.get("/cart/:userId", authMiddleWare, async (req,res) => {
    await cartController.getCart(req,res);
});

router.post("/cart", authMiddleWare, async (req,res) => {
    await cartController.addItem(req,res);
});

router.delete("/cart/:id", authMiddleWare, async (req,res)=>{
    await cartController.removeItem(req,res);
});


export default router;
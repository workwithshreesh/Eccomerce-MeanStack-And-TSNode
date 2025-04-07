import { Router } from "express";
import { OrderController } from "../controller/orderController";


const router = Router();
const orderController = new OrderController();


// Place an order
router.post("/place", async (req, res) => {
    await orderController.PlaceOrder(req, res);
});

// Get order by user ID
router.get("/user/:userId", async (req, res) => {
    orderController.getOrdersByUser(req, res);
});


//Get order by id
router.get("/:orderId", async (req,res) => {
    orderController.getOrderById(req,res);
});


export default router
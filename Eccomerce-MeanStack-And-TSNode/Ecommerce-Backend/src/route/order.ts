import { Router } from "express";
import { OrderController } from "../controller/orderController";
import { authMiddleWare } from "../middlewares/authMiddleware";


const router = Router();
const orderController = new OrderController();


// Place an order
router.post("/order/place", authMiddleWare, async (req, res) => {
    await orderController.PlaceOrder(req, res);
});

// Get order by user ID
router.get("/order/user/:userId", authMiddleWare, async (req, res) => {
    orderController.getOrdersByUser(req, res);
});


//Get order by id
router.get("/order/:orderId", authMiddleWare, async (req,res) => {
    orderController.getOrderById(req,res);
});


export default router
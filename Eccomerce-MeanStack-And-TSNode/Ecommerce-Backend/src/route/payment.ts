import { Router } from "express";
import { PaymentController } from "../controller/paymentController"
import { authMiddleWare } from "../middlewares/authMiddleware";


const router = Router();
const paymentController = new PaymentController();

// Create a payment
router.post("/payments/create", authMiddleWare, async (req, res) =>{
    await  paymentController.createPayment(req, res)
});

// Get payment by ID
router.get("/payments/:id", authMiddleWare, async (req, res) => {
    await paymentController.getPaymentById(req, res);
});

export default router;

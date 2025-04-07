import { Router } from "express";
import { PaymentController } from "../controller/paymentController"


const router = Router();
const paymentController = new PaymentController();

// Create a payment
router.post("/create", async (req, res) =>{
    await  paymentController.createPayment(req, res)
});

// Get payment by ID
router.get("/:id", async (req, res) => {
    await paymentController.getPaymentById(req, res);
});

export default router;

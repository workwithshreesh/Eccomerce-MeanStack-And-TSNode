import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Payment, PaymentStatus } from "../models/Payment";
import { User } from "../models/User";

export class PaymentController {

    private paymentRepo = AppDataSource.getRepository(Payment);
    private userRepo = AppDataSource.getRepository(User);

    // Create Payment
    async createPayment(req: Request, res: Response) {
        try {
            const { userId, amount, method, status } = req.body;

            if (!userId || !amount || !method) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const user = await this.userRepo.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const payment = this.paymentRepo.create({
                user,
                amount,
                method,
                status: status || PaymentStatus.PENDING,
            });

            await this.paymentRepo.save(payment);
            return res.status(201).json({ message: "Payment created", payment });

        } catch (error) {
            console.error("createPayment error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // Get all payments
    async getAllPayments(_req: Request, res: Response) {
        try {
            const payments = await this.paymentRepo.find({ relations: ["user"] });
            return res.status(200).json(payments);
        } catch (error) {
            console.error("getAllPayments error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // Get payment by ID
    async getPaymentById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const payment = await this.paymentRepo.findOne({
                where: { id },
                relations: ["user"]
            });

            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            return res.status(200).json(payment);
        } catch (error) {
            console.error("getPaymentById error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // Update payment status
    async updatePaymentStatus(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;

            const payment = await this.paymentRepo.findOneBy({ id });
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            payment.status = status;
            await this.paymentRepo.save(payment);

            return res.status(200).json({ message: "Payment status updated", payment });
        } catch (error) {
            console.error("updatePaymentStatus error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    // Optional: Delete payment (only if you allow)
    async deletePayment(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.paymentRepo.delete(id);

            if (result.affected === 0) {
                return res.status(404).json({ message: "Payment not found" });
            }

            return res.status(200).json({ message: "Payment deleted" });
        } catch (error) {
            console.error("deletePayment error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
}


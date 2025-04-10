import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Payment, PaymentStatus } from "../models/Payment";
import { User } from "../models/User";
import { Order, Status } from "../models/Order";
import { Cart } from "../models/Cart";

export class PaymentController {
  private paymentRepo = AppDataSource.getRepository(Payment);
  private userRepo = AppDataSource.getRepository(User);
  private cartRepo = AppDataSource.getRepository(Cart);
  private orderRepo = AppDataSource.getRepository(Order);

  // Create payment and order
  async createPayment(req: Request, res: Response) {
    try {
      const { userId, cartId, amount, method } = req.body;

      const parsedUserId = parseInt(userId);
      const parsedCartId = parseInt(cartId);
      const parsedAmount = parseFloat(amount);

      if (!parsedUserId || !parsedCartId || isNaN(parsedAmount) || !method) {
        return res.status(400).json({ message: "Missing or invalid fields" });
      }

      const user = await this.userRepo.findOneBy({ id: parsedUserId });
      if (!user) return res.status(404).json({ message: "User not found" });

      const cart = await this.cartRepo.findOne({
        where: { id: parsedCartId },
        relations: ["user", "items", "items.product"],
      });

      if (!cart || cart.user.id !== parsedUserId) {
        return res.status(404).json({ message: "Cart not found or doesn't belong to user" });
      }

      if (cart.totalAmount !== parsedAmount) {
        return res.status(400).json({ message: "Amount mismatch with cart total" });
      }

      // Create payment
      const payment = this.paymentRepo.create({
        user,
        amount: parsedAmount,
        method,
        status: method === "COD" ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
      });

      await this.paymentRepo.save(payment);

      // Create order after successful or COD payment
      const order = this.orderRepo.create({
        user,
        cart,
        payment,
        status: method === "COD" ? Status.PLACED : Status.PENDING,
      });
      

      await this.orderRepo.save(order);

      return res.status(201).json({
        message: "Payment and Order created successfully",
        payment,
        order,
      });
    } catch (error) {
      console.error("createPayment error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Update payment and order status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      const payment = await this.paymentRepo.findOne({
        where: { id },
        relations: ["order"],
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      payment.status = status;
      await this.paymentRepo.save(payment);

      // If payment is completed, update order status
      if (status === PaymentStatus.COMPLETED && payment.order) {
        payment.order.status = Status.PLACED;
        await this.orderRepo.save(payment.order);
      }

      return res.status(200).json({ message: "Payment (and possibly order) updated", payment });
    } catch (error) {
      console.error("updatePaymentStatus error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getAllPayments(_req: Request, res: Response) {
    try {
      const payments = await this.paymentRepo.find({ relations: ["user"] });
      return res.status(200).json(payments);
    } catch (error) {
      console.error("getAllPayments error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getPaymentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const payment = await this.paymentRepo.findOne({
        where: { id },
        relations: ["user", "order"],
      });

      if (!payment) return res.status(404).json({ message: "Payment not found" });

      return res.status(200).json(payment);
    } catch (error) {
      console.error("getPaymentById error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

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

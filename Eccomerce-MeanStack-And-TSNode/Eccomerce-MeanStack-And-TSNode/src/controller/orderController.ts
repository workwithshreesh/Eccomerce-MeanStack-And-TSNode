import { Request, Response } from "express";
import { Order, Status } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Payment, PaymentStatus } from "../models/Payment";
import { ShippingAddress } from "../models/ShipingAddress";
import { Cart } from "../models/Cart";
import { CartItem } from "../models/CartItem";


export class OrderController {

  private orderRepo = AppDataSource.getRepository(Order);
  private orderItemRepo = AppDataSource.getRepository(OrderItem);
  private userRepo = AppDataSource.getRepository(User);
  private paymentRepo = AppDataSource.getRepository(Payment);
  private shippingRepo = AppDataSource.getRepository(ShippingAddress);
  private cartRepo = AppDataSource.getRepository(Cart);
  private cartItemRepo = AppDataSource.getRepository(CartItem);


  async PlaceOrder(req: Request, res: Response) {
    try {
      const { userId, paymentId, shipingAddressId } = req.body;

      if (!userId || !paymentId || !shipingAddressId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await this.userRepo.findOne({ where: { id: userId } });
      const cart = await this.cartRepo.findOne({
        where: { user: { id: userId } },
        relations: ["items", "items.product"],
      });
      const payment = await this.paymentRepo.findOne({
        where: { id: paymentId },
        relations: ["user", "order"],
      });
      const shippingAddress = await this.shippingRepo.findOne({
        where: { id: shipingAddressId },
      });

      if (!user || !cart || !payment || !shippingAddress) {
        return res.status(400).json({ message: "One or more required entities not found" });
      }

      if (cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Validate payment belongs to user
      if (payment.user.id !== user.id) {
        return res.status(403).json({ message: "Payment does not belong to user" });
      }

      // Prevent placing order twice with same payment
      if (payment.order) {
        return res.status(400).json({ message: "Order already exists for this payment" });
      }

      // For 'PAY' method, ensure payment is completed
      if (payment.method === "PAY" && payment.status !== PaymentStatus.COMPLETED) {
        return res.status(400).json({ message: "Online payment not completed" });
      }

      await AppDataSource.manager.transaction(async (manager) => {

        for (const item of cart.items) {
          if (item.product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product: ${item.product.name}`);
          }
        }

        const orderStatus =
          payment.method === "COD"
            ? Status.PENDING
            : payment.status === PaymentStatus.COMPLETED
              ? Status.SUCCESS
              : Status.PENDING;

        const order = manager.create(Order, {
          user,
          status: orderStatus,
          createdAt: new Date(),
          totalAmount: cart.totalAmount,
          payment,
          shipingAddress: shippingAddress,
        });

        await manager.save(order);

        const orderItems = cart.items.map((item) =>
          manager.create(OrderItem, {
            order,
            product: item.product,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })
        );

        await manager.save(OrderItem, orderItems);

        // Deduct stock
        for (const item of cart.items) {
          item.product.stock -= item.quantity;
          await manager.save(item.product);
        }


        // Link order to payment
        payment.order = order;
        await manager.save(Payment, payment);

        // Clear cart
        await manager.delete(CartItem, { cart: { id: cart.id } });
        cart.totalAmount = 0;
        cart.quantity = 0;
        await manager.save(Cart, cart);

        return res.status(201).json({ message: "Order placed", order });
      });
    } catch (error) {
      console.log("Error in place order:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }




  async getAllOrders(req: Request, res: Response) {
    try {

      const order = await this.orderRepo.find({
        relations: ["user", "payment", "shipingAddress", "items", "items.product"]
      });

      return res.status(200).json(order);

    } catch (error) {
      console.log("Error in get all order", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }


  async getOrdersByUser(req: Request, res: Response) {
    try {

      const userId = parseInt(req.params.userId);
      const orders = await this.orderRepo.find({
        where: { user: { id: userId } },
        relations: ["payment", "shipingAddress", "items", "items.product"]
      })

      return res.status(200).json(orders);

    } catch (error) {
      console.error("Error in getOrdersByUsers", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.id);
      const order = await this.orderRepo.findOne({
        where: { id: orderId },
        relations: ["user", "payment", "shipingAddress", "items", "items.product"]
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(order)

    } catch (error) {
      console.error("Error in getOrderById", error);
      return res.status(500).json({ message: "Server Error" });
    }

  }

  async UpdateOrderStatus(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      const order = await this.orderRepo.findOneBy({ id: orderId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.status = status;
      await this.orderRepo.save(order);

      return res.status(200).json({ message: "Order status updated" });
    } catch (error) {
      console.error("Error in updateOrderStatus", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }

}
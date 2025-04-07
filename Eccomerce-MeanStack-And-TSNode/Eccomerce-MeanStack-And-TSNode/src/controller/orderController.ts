import {Request, Response} from "express";
import { Order, Status } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Payment } from "../models/Payment";
import { ShipingAddress } from "../models/ShipingAddress";
import { Cart } from "../models/Cart";
import { CartItem } from "../models/CartItem";


export class OrderController {

    private orderRepo = AppDataSource.getRepository(Order);
    private orderItemRepo = AppDataSource.getRepository(OrderItem);
    private userRepo = AppDataSource.getRepository(User);
    private paymentRepo = AppDataSource.getRepository(Payment);
    private shippingRepo = AppDataSource.getRepository(ShipingAddress);
    private cartRepo = AppDataSource.getRepository(Cart);
    private cartItemRepo = AppDataSource.getRepository(CartItem);


    async PlaceOrder(req:Request, res:Response){

        try{

            const { userId, paymentId, shipingAddressId } = req.body;

            if(userId || paymentId || shipingAddressId){
                return res.status(400).json({message:"Some required field is missing"});
            }

            const user = await this.userRepo.findOne({ where: { id: userId } });
            const cart = await this.cartRepo.findOne(
                    { where: { user: { id: userId } },
                    relations: ["items", "items.product"] });

            const payment = await this.paymentRepo.findOne({ where: {id: paymentId}  });
            const shippingAddress = await this.shippingRepo.findOne({ where: {id: shipingAddressId} });

            if( !user || !cart || !payment || !shippingAddress ){
                return res.status(400).json({message:"Required repository modal is null"})
            }

            if(cart.items.length === 0){
                return res.status(400).json({message:"Cart is empty"});
            }

            await AppDataSource.manager.transaction(async (manager) => {
                const order = manager.create(Order, {
                    user,
                    status: Status.PENDING,
                    createdAt: new Date(),
                    totalAmount: cart.totalAmount,
                    payment,
                    shipingAddress: shippingAddress
                });

                await manager.save(order);

                const orderItems = cart.items.map(item =>
                    manager.create(OrderItem, {
                        order,
                        product: item.product,
                        quantity: item.quantity,
                        subtotal: item.subtotal
                    })
                );

                await manager.save(OrderItem, orderItems);

                // Clear cart after placing order
                await manager.delete(CartItem, { cart: { id: cart.id } });
                cart.totalAmount = 0;
                cart.quantity = 0;
                await manager.save(Cart, cart);
            });


        } catch(error) {
            console.log("error in place order",error);
            throw error;
        }

    }

    async getAllOrders(req:Request,res:Response){
        try {

            const order = await this.orderRepo.find({
                relations: ["user", "payment", "shipingAddress", "items", "items.product"]
            });

            return res.status(200).json(order);
            
        } catch (error) {
            console.log("Error in get all order", error);
            return res.status(500).json({message:"Server Error"});
        }
    }


    async getOrdersByUser(req: Request, res:Response){
        try {

            const userId = parseInt(req.params.userId);
            const orders = await this.orderRepo.find({
                where: { user: { id: userId }},
                relations: ["payment", "shipingAddress","items","items.product"]
            })

            return res.status(200).json(orders);
            
        } catch (error) {
            console.error("Error in getOrdersByUsers", error );
            return res.status(500).json({message:"Server Error"});
        }
    }

    async getOrderById(req:Request, res:Response){
        try {
            const orderId = parseInt(req.params.id);
            const order = await this.orderRepo.findOne({
                where: { id: orderId },
                relations: ["user", "payment", "shipingAddress", "items", "items.product"]
            });

            if(!order){
                return res.status(404).json({message:"Order not found"});
            }

            return res.status(200).json(order)

        } catch (error) {
            console.error("Error in getOrderById", error);
            return res.status(500).json({message:"Server Error"});
        }

    }

    async UpdateOrderStatus(req:Request, res:Response){
        try {
            const orderId = parseInt(req.params.id);
            const { status } = req.body;

            const order = await this.orderRepo.findOneBy({id: orderId});

            if(!order){
                return res.status(404).json({message:"Order not found"});
            }

            order.status = status;
            await this.orderRepo.save(order);

            return res.status(200).json({message:"Order status updated"});
        } catch (error) {
            console.error("Error in updateOrderStatus",error);
            return res.status(500).json({message:"Server Error"});
        }
    }

}
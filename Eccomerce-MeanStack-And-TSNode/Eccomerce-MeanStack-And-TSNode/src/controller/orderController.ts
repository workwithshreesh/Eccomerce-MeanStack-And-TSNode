import {Request, Response} from "express";
import { Order, Status } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Payment } from "../models/Payment";
import { ShipingAddress } from "../models/ShipingAddress";
import { Cart } from "../models/Cart";
import { CartItem } from "../models/CartItem";


class OrderController {

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

            const order = this.orderRepo.create({
                user,
                status: Status.PENDING,
                createdAt: new Date(),
                totalAmount: cart.totalAmount,
                payment,
                shipingAddress: shippingAddress
            });

            await this.orderRepo.save(order);

            // await AppDataSource.getRepository(Order).manager.transaction(async (transactionalEntityManager) => {
            //     await transactionalEntityManager.save(Order, order);
            //     await transactionalEntityManager.save(OrderItem, OrderItem);
            // });

            await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.save(Order, order);
                await transactionalEntityManager.save(OrderItem, orderItems);
            });
            
            


        } catch(error) {
            console.log("error in place order",error);
            throw error;
        }

    }

}
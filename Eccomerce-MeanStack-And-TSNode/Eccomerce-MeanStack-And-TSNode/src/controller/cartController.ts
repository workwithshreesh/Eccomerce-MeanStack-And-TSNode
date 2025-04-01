import {Request, Response} from 'express';
import { AppDataSource } from '../config/data-source';
import { Cart } from '../models/Cart';
import { Repository } from 'typeorm';
import { CartItem } from '../models/CartItem';
import { User } from '../models/User';
import { Product } from '../models/Product';



class CartController{
    private cartRepository!: Repository<Cart>
    private cartItemRepository!: Repository<CartItem>
    private userRepository!: Repository<User>
    private productRepository!:Repository<Product>
    
    constructor(){
        this.cartRepository = AppDataSource.getRepository(Cart);
        this.cartItemRepository = AppDataSource.getRepository(CartItem);
        this.userRepository = AppDataSource.getRepository(User);
        this.productRepository = AppDataSource.getRepository(Product)
    }

    async getCart(req:Request, res:Response){

        try{

            const userId = parseInt(req.params.userId)
        if(!userId){
            return res.status(200).json({message:"user id is not available"})
        }

        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId }},
            relations: ["items", "items.product"]
        });

        if(!cart){
            return res.status(400).json({message:"cart not found"})
        }

        return res.status(200).json(cart)

        } catch(error){
            console.log("The error comes in get cart", error);
            throw error;
        }

    }

    async addItem(req: Request, res: Response) {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!user || !product) {
            return res.status(404).json({ message: "User or Product not found" });
        }

        let cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ["items", "items.product"]
        });

        if (!cart) {
            cart = this.cartRepository.create({ user, totalAmount: 0 });
            await this.cartRepository.save(cart);
        }

        let cartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, product: { id: productId } }
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.subtotal = cartItem.quantity * parseFloat(product.price.toString());
        } else {
            cartItem = this.cartItemRepository.create({
                cart,
                product,
                quantity,
                subtotal: quantity * parseFloat(product.price.toString())
            });
        }

        await this.cartItemRepository.save(cartItem);

        cart.totalAmount += cartItem.subtotal;
        await this.cartRepository.save(cart);

        res.status(200).json({ message: "Item added to cart", cart });
    }
    

    async updateItem(req: Request, res: Response) {
        try{
            const { cartItemId, quantity } = req.body;

        if (!cartItemId || quantity <= 0) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const cartItem = await this.cartItemRepository.findOne({
            where: { id: cartItemId },
            relations: ["cart", "product"]
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const oldSubtotal = cartItem.subtotal;
        cartItem.quantity = quantity;
        cartItem.subtotal = quantity * parseFloat(cartItem.product.price.toString());

        await this.cartItemRepository.save(cartItem);

        cartItem.cart.totalAmount += cartItem.subtotal - oldSubtotal;
        await this.cartRepository.save(cartItem.cart);

        res.status(200).json({ message: "Cart item updated", cart: cartItem.cart });

        } catch (error){
            console.log("update item function error",error);
            throw error;
        }
    }

    async removeItem(req:Request, res:Response){

        try{

            const cartItemId = parseInt(req.params.id);

            if( !cartItemId || isNaN(cartItemId)){
                res.status(400).json({message:"Not found id"})
            }

            const cartItem = await this.cartItemRepository.findOne({
                where: { id: cartItemId },
                relations: ["cart"]
            });

            if (!cartItem) {
                return res.status(404).json({ message: "Cart item not found" });
            }
    
            const cart = cartItem.cart;
            cart.totalAmount -= cartItem.subtotal;
    
            await this.cartItemRepository.remove(cartItem);
            await this.cartRepository.save(cart);
    
            res.status(200).json({ message: "Cart item removed", cart });

        } catch (error){
            console.log("remove item have error",error)
            throw error
        }
    }

    async clearCart(req:Request, res:Response){

        try{



        } catch (error){
            throw error
        }

    }

    async calculateTotal(cartId:number): Promise<number>{
        try{

            const cartItems = await this.cartItemRepository.find({
                where: {cart: {id: cartId}}
            });
    
            return cartItems.reduce((total, item) => total + item.subtotal , 0);

        } catch (error){
            console.log("Calculate total have error",error)
            throw error
        }
        
    }
}


export default CartController;
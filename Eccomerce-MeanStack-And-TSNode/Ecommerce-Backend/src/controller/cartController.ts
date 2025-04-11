import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Cart } from '../models/Cart';
import { Repository } from 'typeorm';
import { CartItem } from '../models/CartItem';
import { User } from '../models/User';
import { Product } from '../models/Product';

class CartController {
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;
  private userRepository: Repository<User>;
  private productRepository: Repository<Product>;

  constructor() {
    this.cartRepository = AppDataSource.getRepository(Cart);
    this.cartItemRepository = AppDataSource.getRepository(CartItem);
    this.userRepository = AppDataSource.getRepository(User);
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async getCart(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      if (!userId) {
        return res.status(400).json({ message: 'User ID is not available' });
      }

      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error in getCart:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async addItem(req: Request, res: Response) {
    try {
      const { userId, productId, quantity } = req.body;

      if (!userId || !productId || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid data provided' });
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const product = await this.productRepository.findOne({ where: { id: productId } });

      if (!user || !product) {
        return res.status(404).json({ message: 'User or Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }

      let cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart) {
        cart = this.cartRepository.create({ user, totalAmount: 0, quantity: 0, items: [] });
        await this.cartRepository.save(cart);
      }

      let cartItem = cart.items.find((item) => item.product.id === productId);

      if (cartItem) {
        const newQuantity = cartItem.quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({
            message: `Cannot add ${quantity} units. Only ${product.stock - cartItem.quantity} more in stock.`,
          });
        }

        cart.totalAmount -= cartItem.subtotal;
        cartItem.quantity = newQuantity;
        cartItem.subtotal = newQuantity * parseFloat(product.price.toString());
        cart.totalAmount += cartItem.subtotal;
        cart.quantity += quantity;
      } else {
        cartItem = this.cartItemRepository.create({
          cart,
          product,
          quantity,
          subtotal: quantity * parseFloat(product.price.toString()),
        });

        cart.items.push(cartItem);
        cart.totalAmount += cartItem.subtotal;
        cart.quantity += quantity;
      }

      await this.cartItemRepository.save(cartItem);
      await this.cartRepository.save(cart);

      return res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
      console.error('Error in addItem:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const { cartItemId, quantity } = req.body;

      if (!cartItemId || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid data provided' });
      }

      const cartItem = await this.cartItemRepository.findOne({
        where: { id: cartItemId },
        relations: ['cart', 'product'],
      });

      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      const oldSubtotal = cartItem.subtotal;
      cartItem.quantity = quantity;
      cartItem.subtotal = quantity * parseFloat(cartItem.product.price.toString());

      await this.cartItemRepository.save(cartItem);

      cartItem.cart.totalAmount += cartItem.subtotal - oldSubtotal;
      await this.cartRepository.save(cartItem.cart);

      return res.status(200).json({ message: 'Cart item updated', cart: cartItem.cart });
    } catch (error) {
      console.error('Error in updateItem:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async removeItem(req: Request, res: Response) {
    try {
      const cartItemId = parseInt(req.params.id);

      if (!cartItemId || isNaN(cartItemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }

      const cartItem = await this.cartItemRepository.findOne({
        where: { id: cartItemId },
        relations: ['cart', 'product'],
      });

      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      const product = await this.productRepository.findOne({
        where: { id: cartItem.product.id }
      });

      if(!product){
        return res.status(200).json({message:"Associated product not found"});
      }

      product.stock += cartItem.quantity;
      await this.productRepository.save(product);

      const cart = await this.cartRepository.findOne({
        where: { id: cartItem.cart.id },
        relations: ['items', 'items.product'],
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.totalAmount = Math.max(0, cart.totalAmount - cartItem.subtotal);
      cart.quantity = Math.max(0, cart.quantity - cartItem.quantity);

      await this.cartItemRepository.remove(cartItem);
      await this.cartRepository.save(cart);

      return res.status(200).json({ message: 'Cart item removed', cart });
    } catch (error) {
      console.error('Error in removeItem:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

 
}

export default CartController;
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cart, cart => cart.items)
  cart!: Cart;

  @ManyToOne(() => Product, product => product.cartItems)
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;
}

import {Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn} from 'typeorm';
import { Order } from "./Order"
import { Cart } from "./Cart"
import { ReviewRating } from './ReviewRatings';
import { ShippingAddress } from './ShipingAddress';
import { Payment } from './Payment';
import { Product } from './Product';

export enum Role{
    USER = "user",
    SELLER = "seller",
    ADMIN = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Cart, cart => cart.user)
  carts!: Cart[];

  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  @OneToMany(() => ReviewRating, review => review.user)
  reviews!: ReviewRating[];

  @OneToMany(() => Payment, payment => payment.user)
  payments!: Payment[];

  @OneToMany(() => ShippingAddress, address => address.user)
  shippingAddresses!: ShippingAddress[];

  @OneToMany(() => Product, product => product.seller)
  products!: Product[];
}

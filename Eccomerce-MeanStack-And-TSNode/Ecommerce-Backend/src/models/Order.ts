// src/models/Order.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Cart } from "./Cart";
import { Payment } from "./Payment";
import { OrderItem } from "./OrderItem";

export enum Status {
  PENDING = "PENDING",
  PLACED = "PLACED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  status!: Status;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @OneToOne(() => Cart)
  @JoinColumn()
  cart!: Cart;

  @OneToOne(() => Payment, (payment) => payment.order)
  @JoinColumn()
  payment!: Payment;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;
}

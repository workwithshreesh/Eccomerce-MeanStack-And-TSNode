import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany} from 'typeorm';
import { Product } from './Product';
import { User } from "./User"
import { CartItem } from './CartItem';


@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.carts)
  user!: User;

  @OneToMany(() => CartItem, item => item.cart, { cascade: true, eager: true })
  items!: CartItem[];

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount!: number;
}


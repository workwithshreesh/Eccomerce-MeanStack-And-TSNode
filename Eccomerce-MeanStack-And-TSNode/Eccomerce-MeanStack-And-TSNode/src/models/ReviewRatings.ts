import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Product } from './Product'

@Entity()
export class ReviewRating {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.reviews)
  user!: User;

  @ManyToOne(() => Product, product => product.reviews)
  product!: Product;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text' })
  review!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

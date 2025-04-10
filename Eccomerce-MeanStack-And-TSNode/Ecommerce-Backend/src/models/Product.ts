import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { ProductImage } from "./ProductImage";
import { ReviewRating } from "./ReviewRatings";
import { CartItem } from "./CartItem";
import { OrderItem } from "./OrderItem";
import { User } from "./User";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sku!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', default: 'No Description' })
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @ManyToOne(() => User, user => user.products)
  seller!: User;

  @ManyToOne(() => Category, category => category.products)
  category!: Category;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images!: ProductImage[];

  @OneToMany(() => ReviewRating, review => review.product)
  reviews!: ReviewRating[];

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems!: OrderItem[];
}

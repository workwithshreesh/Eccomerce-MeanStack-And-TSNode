import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Exclude } from "class-transformer";

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Exclude()  
  @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
  product!: Product;

  @Column()
  url!: string;
}

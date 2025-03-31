import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { ProductImage } from "./ProductImage";
import { ReviewRating } from "./ReviewRatings";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  sku!: string;

  @Column({ nullable: false })
  name!: string;

  @Column("decimal", { nullable: false })
  price!: number;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: "CASCADE" })
  category!: Category;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images!: ProductImage[];  
    categoryId: any;

  @OneToMany(() => ReviewRating, (review) => review.product)
  review!:ReviewRating[];

  
}

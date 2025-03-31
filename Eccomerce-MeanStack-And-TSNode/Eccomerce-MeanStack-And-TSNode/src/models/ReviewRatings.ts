import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Product } from './Product'

@Entity()
export class ReviewRating{
    @PrimaryGeneratedColumn()
    id!:number;

    @ManyToOne(() => User, (user) => user.review)
    user!:User;

    @ManyToOne(() => Product, (product) => product.review)
    product!:Product;

    @Column()
    rating!:number;

    @Column({
        type:"text"
    })
    review!:string;

    @Column({
        type:"timestamp",
        default:() => "CURRENT_TIMESTAMP"
    })
    createdAt!:Date;

    @UpdateDateColumn({
        type:"timestamp",
        default:() => "CURRENT_TIMESTAMP"
    })
    updatedAt!:Date;

}
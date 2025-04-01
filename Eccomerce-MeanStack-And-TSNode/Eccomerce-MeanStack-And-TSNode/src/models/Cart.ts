import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany} from 'typeorm';
import { Product } from './Product';
import { User } from "./User"
import { CartItem } from './CartItem';


@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id!:number;


    @Column({
        type:"int",
        default:1
    })
    quantity!:number

    @Column("decimal", { precision:10, scale:2 })
    totalAmount!:number;

    @ManyToOne(() => User, (user) => user.carts, {cascade:true, onDelete:"CASCADE"})
    user!:User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    items!:CartItem[]

    // @ManyToMany(() => Product)
    // @JoinTable()
    // products!:Product[];

}
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany} from 'typeorm';
import { Product } from './Product';
import { User } from "./User"

@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column("decimal", { precision:10, scale:2 })
    totalAmount!:number;

    @ManyToOne(() => User, (user) => user.carts)
    user!:User;

    @ManyToMany(() => Product)
    @JoinTable()
    products!:Product[]
}
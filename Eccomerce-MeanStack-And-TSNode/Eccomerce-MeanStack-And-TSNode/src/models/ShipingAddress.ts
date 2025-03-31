import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";
import { User } from "./User";
import { Order } from "./Order";

@Entity()
export class ShipingAddress{
    @PrimaryGeneratedColumn()
    id!:number;

    @ManyToOne(
              () => User, 
              (user) => user.shipingAddress, 
              { cascade:true, onDelete: "CASCADE"}
            )
    user!:User;

    @Column()
    address!:string;

    @Column()
    city!:string;

    @Column()
    zipCode!:number;

    @Column()
    country!:number;

    @OneToOne(() => Order, (order) => order.shipingAddress)
    order!:Order;
    

}
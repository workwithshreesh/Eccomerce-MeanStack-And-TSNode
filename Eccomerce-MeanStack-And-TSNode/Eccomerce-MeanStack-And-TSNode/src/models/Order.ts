import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne, OneToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Payment } from "./Payment";
import { ShipingAddress } from "./ShipingAddress";
import { OrderItem } from "./OrderItem"

export enum Status{
    PENDING = "Placed",
    SHIPED = "Shiped",
    DELIVERED = "Delivered"
}

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({
        type:"enum",
        enum:Status,
        default:Status.PENDING
    })
    status!:string;

    @Column("decimal",{ precision: 10, scale: 2})
    totalAmount!:number;

    @Column()
    createdAt!:Date;

    @ManyToOne(() => User, (user) => user.orders)
    user!:User;

    @OneToOne( () => Payment)
    @JoinColumn()
    payment!: Payment;

    @OneToOne(() => ShipingAddress, (shipingAddress) => shipingAddress.order, {
        cascade: true,
        eager: true
      })
      @JoinColumn()
      shipingAddress!: ShipingAddress;
    
      @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
        cascade: true,
        eager: true
      })
      items!: OrderItem[]; // 💥 This is where products in the order are stored
    



}
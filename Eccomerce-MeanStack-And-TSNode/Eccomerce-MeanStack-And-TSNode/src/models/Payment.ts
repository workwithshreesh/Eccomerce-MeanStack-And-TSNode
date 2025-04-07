import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Order } from "./Order";

export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}


@Entity()
export class Payment{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    PaymentMethod!:string;

    @Column("decimal",{ precision: 10, scale: 2 })
    amount!:number;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status!: PaymentStatus;


    @OneToOne(()=>Order, (order) => order.payment)
    order!:Order

}
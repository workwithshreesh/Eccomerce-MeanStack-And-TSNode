import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Order } from "./Order";

@Entity()
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.shippingAddresses)
  user!: User;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  zipCode!: string;

  @Column()
  country!: string;
}

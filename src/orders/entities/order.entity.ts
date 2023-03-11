import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/users.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Dish } from '../../restaurants/entities/dish.entity';
import { OrderItem } from './order-item.entity';
import { IsEnum, IsNumber } from 'class-validator';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  customer?: User;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  driver?: User;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;

  @Field((type) => [OrderItem])
  @ManyToMany((type) => OrderItem)
  @JoinTable()
  items: OrderItem[];

  @Column({ nullable: true })
  @Field((type) => Number, { nullable: true })
  @IsNumber()
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  @Field((type) => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User } from '../users/entities/users.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurants.findOne({
      where: {
        id: restaurantId,
      },
    });

    const order = await this.orders.save(
      this.orders.create({
        customer,
        restaurant,
      }),
    );

    console.log(order);

    if (!restaurant)
      return {
        ok: false,
        error: 'Restaurant not found!',
      };
    return {
      ok: true,
    };
  }
}

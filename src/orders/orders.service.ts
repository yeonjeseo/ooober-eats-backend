import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User } from '../users/entities/users.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from '../restaurants/entities/dish.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
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
    let totalPrice = 0;
    for (const item of items) {
      const dish = await this.dishes.findOne({
        where: {
          id: item.dishId,
        },
      });
      if (!dish) {
        // abort this whole thing
        return {
          ok: false,
          error: 'Dish not found',
        };
      }
      let itemPrice = dish.price;

      for (const itemOption of item.options) {
        const dishOption = dish.options.find(
          (dishOption) => dishOption.name === itemOption.name,
        );
        if (!dishOption) {
          // abort this whole thing
          return {
            ok: false,
            error: 'Option not found',
          };
        }
        // extra가 있다면 바로 합계,
        // Extra가 없다면 choice 배열 한번 더 탐색
        // 공짜도 있으므로 아무것도 없으면 0
        const optionExtra =
          dishOption.extra ||
          dishOption.choices.find((choice) => choice.name === itemOption.choice)
            .extra ||
          0;
        itemPrice += optionExtra;
      }
      // await this.orderItems.save(
      //   this.orderItems.create({
      //     dish,
      //     options: item.options,
      //   }),
      // );
      totalPrice += itemPrice;
    }

    console.log(totalPrice);
    // const order = await this.orders.save(
    //   this.orders.create({
    //     customer,
    //     restaurant,
    //   }),
    // );

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

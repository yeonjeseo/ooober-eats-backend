import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User, UserRole } from '../users/entities/users.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from '../restaurants/entities/dish.entity';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';

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
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          id: restaurantId,
        },
      });

      if (!restaurant)
        return {
          ok: false,
          error: 'Restaurant not found!',
        };

      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];

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
        let dishFinalPrice = dish.price;

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
            dishOption.choices.find(
              (choice) => choice.name === itemOption.choice,
            ).extra ||
            0;
          dishFinalPrice += optionExtra;
        }
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);

        orderFinalPrice += dishFinalPrice;
      }
      await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not create order',
      };
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];
      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: {
              id: user.id,
            },
          },
        });
      } else if (user.role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: {
              id: user.id,
            },
          },
        });
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.restaurants.find({
          where: {
            owner: {
              id: user.id,
            },
          },
          relations: ['orders'],
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
      }
      return {
        ok: true,
        orders,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not get orders',
      };
    }
  }
}

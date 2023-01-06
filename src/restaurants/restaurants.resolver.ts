import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { boolean } from 'joi';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { LoginOutput } from '../users/dtos/login.dto';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  /**
   * @param restaurantService
   * Dependency Injection
   * 의존성 주입할 객체는 provider에서 추가되어야 함.
   *
   */

  constructor(private readonly restaurantService: RestaurantService) {}

  /**
   * query 데코레이터는 타입을 리턴하는 함수를 매개변수로 넣어야 함.
   * graphql schema와 typescript에서  배열 리턴 표현 방법이 다름
   */
  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((returns) => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  @Mutation((returns) => LoginOutput)
  async updateRestaurant(
    @Args('input') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<LoginOutput> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: e,
      };
    }
  }
}
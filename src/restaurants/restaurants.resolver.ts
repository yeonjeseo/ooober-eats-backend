import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import {
  CreateRestaurantInputType,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { User } from '../users/entities/users.entity';
import { AuthUser } from '../auth/auth-user.decorator';

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
   * graphql schema 와 typescript 에서  배열 리턴 표현 방법이 다름
   */
  @Mutation((returns) => CreateRestaurantOutput)
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInputType,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }
}
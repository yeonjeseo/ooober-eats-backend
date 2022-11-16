import {Resolver, Query, Args, Mutation} from "@nestjs/graphql";
import {Restaurant} from "./entities/restanrant.entity";
import {CreateRestaurantDto} from "./dtos/create-restaurant.dto";

@Resolver(of => Restaurant)
export class RestaurantResolver {
    /**
     * query 데코레이터는 타입을 리턴하는 함수를 매개변수로 넣어야 함.
     * graphql schema와 typescript에서  배열 리턴 표현 방법이 다름
     */
    @Query(returns => [Restaurant])
    restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
        console.log(veganOnly)
        return []
    }

    @Mutation(returns => Boolean)
    createRestaurant(@Args() CreateRestaurantDto: CreateRestaurantDto) {
        console.log(CreateRestaurantDto)
        return true
    }
}
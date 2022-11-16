import {Resolver, Query} from "@nestjs/graphql";

@Resolver()
export class RestaurantResolver {
    /**
     * query 데코레이터는 타입을 리턴하는 함수를 매개변수로 넣어야 함.
     */
    @Query(returns => Boolean)
    isPizzaGood():Boolean {
        return true
    }
}
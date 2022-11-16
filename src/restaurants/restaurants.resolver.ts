import {Resolver, Query} from "@nestjs/graphql";
import {Restaurant} from "./entities/restanrant.entity";

@Resolver(of => Restaurant)
export class RestaurantResolver {
    /**
     * query 데코레이터는 타입을 리턴하는 함수를 매개변수로 넣어야 함.
     */
    @Query(returns => Restaurant)
    myRestaurant () {
        return true
    }
}
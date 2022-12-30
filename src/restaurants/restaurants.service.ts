import {Injectable} from "@nestjs/common";
import {Restaurant} from "./entities/restanrant.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

/**
 * RrestaurantService를 RestaurantResolvers에 Inject
 */
@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>
    ) {
    }
    getAll(): Promise<Restaurant[]> {
        return this.restaurants.find()
    }
}
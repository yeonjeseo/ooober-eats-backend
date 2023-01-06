import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

/**
 * RrestaurantService를 RestaurantResolvers에 Inject
 */
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // 여기서의 restaurants.create() DB에 레코드를 저장하지 않고 Nodejs 메모리에 임시 적재하는 클래스 인스턴스임. db에 저장하고 싶다면 .save() 메서드를 써야 함.
    const newRestaurant = this.restaurants.create(createRestaurantDto);
    return this.restaurants.save(newRestaurant);
  }

  updateRestaurant({ id, data }: UpdateRestaurantDto): Promise<any> {
    // DB에 레코드가 존재하는지 확인하지 않
    return this.restaurants.update(id, { ...data });
  }
}
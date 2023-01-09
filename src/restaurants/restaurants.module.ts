import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { TypeOrmExModule } from './repositories/typeorm-ex.module';
import { CategoryRepository } from './repositories/category.repository';

/**
 * forFeature는 TypeOrmModule이 특정 Feature 를 import 할 수 있도록 해줌
 *
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    TypeOrmExModule.forCustomRepository([CategoryRepository]),
  ],
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
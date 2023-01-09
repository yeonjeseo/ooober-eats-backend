import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInputType,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { User } from '../users/entities/users.entity';
import { Category } from './entities/category.entity';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';

/**
 * RrestaurantService 를 RestaurantResolvers 에 Inject
 */
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInputType,
  ): Promise<CreateRestaurantOutput> {
    try {
      /**
       * categoryName 에 slug 를 만든다?
       * case-insensitive, whitespaces
       */
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({
        where: { name: categoryName },
      });
      if (!category)
        category = await this.categories.save(
          this.categories.create({ slug: categorySlug, name: categoryName }),
        );
      // 여기서의 restaurants.create() DB에 레코드를 저장하지 않고 Nodejs 메모리에 임시 적재하는 클래스 인스턴스임. db에 저장하고 싶다면 .save() 메서드를 써야 함.
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      newRestaurant.category = category;

      await this.restaurants.save(newRestaurant);

      /**
       * 레스토랑은 카테고리를 가져야 한다.
       * createRestaurantInput 을 수정
       * OmitType 대신 PickType 을 사용
       */
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not create restaurant' };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return { ok: true };
  }
}
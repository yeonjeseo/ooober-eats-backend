import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Raw, Repository } from 'typeorm';
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
import { CategoryRepository } from './repositories/category.repository';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { Dish } from './entities/dish.entity';

/**
 * RrestaurantService 를 RestaurantResolvers 에 Inject
 */
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    // module 에서 imports [] typeorm forFeature 에 있는 배열 entity 요소를 읽어오는 것 같다.
    // @InjectRepository(Category)
    private readonly categories: CategoryRepository,

    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
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

      // 여기서의 restaurants.create() DB에 레코드를 저장하지 않고 Nodejs 메모리에 임시 적재하는 클래스 인스턴스임. db에 저장하고 싶다면 .save() 메서드를 써야 함.
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );

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
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: editRestaurantInput.restaurantId },
        loadRelationIds: true,
      });

      if (!restaurant) return { ok: false, error: 'Restaurant Not Found!' };
      if (owner.id !== restaurant.ownerId)
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };

      let category: Category = null;
      if (editRestaurantInput.categoryName)
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );

      // 전개연산자로 entity 구성 빠르게
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not edit Restaurant' };
    }
  }

  async deleteRestaurant(
    owner: User,
    deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      await this.restaurants.delete({
        id: deleteRestaurantInput.restaurantId,
      });

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not delete Restaurant' };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not read all categories',
      };
    }
  }

  countRestaurantsByCategory(category: Category): Promise<number> {
    return this.restaurants.count({
      where: {
        category: {
          id: category.id,
        },
      },
    });
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      // 바로 조인해서 페이지네이션 없이 보내주면 DB 뻗을 수 있음
      // const category = await this.categories.findOne({
      //   where: { slug },
      //   relations: ['restaurants'],
      // });

      const category = await this.categories.findOne({ where: { slug } });

      if (!category) return { ok: false, error: 'Category not found' };

      const restaurants = await this.restaurants.find({
        where: {
          category: {
            id: category.id,
          },
        },
        take: 5,
        skip: (page - 1) * 5,
      });
      const totalResults = await this.countRestaurantsByCategory(category);
      console.log(restaurants);
      return { ok: true, restaurants, totalPages: Math.ceil(totalResults / 5) };
    } catch (e) {
      return { ok: false, error: 'Could not find Category' };
    }
  }
  async allRestaurants(
    restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    try {
      const [results, totalCount] = await this.restaurants.findAndCount({
        take: 5,
        skip: (restaurantsInput.page - 1) * 5,
      });
      return {
        ok: true,
        results,
        totalCount,
        totalPages: Math.ceil(totalCount / 5),
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not get restaurants list',
      };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          id: restaurantId,
        },
        relations: ['menu'],
      });
      return { ok: true, restaurant };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not find restaurant!' };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      // ORM version
      // const [restaurants, totalCount] = await this.restaurants.findAndCount({
      //   where: {
      //     name: ILike(`%${query}%`),
      //   },
      //   take: 5,
      //   skip: (page - 1) * 5,
      // });

      // partial raw query version
      const [restaurants, totalCount] = await this.restaurants.findAndCount({
        where: {
          name: Raw((name) => `${name} ILIKE ${query}`),
        },
        take: 5,
        skip: (page - 1) * 5,
      });

      return {
        ok: true,
        restaurants,
        totalCount,
        totalPages: Math.ceil(totalCount / 5),
      };
    } catch (e) {
      return { ok: false, error: 'Could not find restaurant by name' };
    }
  }

  /**
   * 1. 식당을 찾는다
   * 2. 주인 검증
   * 3. json 준비
   * 4. 식당 Id에 해당하는 음식 생성
   */
  async createDish(
    owner,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: createDishInput.restaurantId, owner: { id: owner.id } },
      });
      if (!restaurant) return { ok: false, error: 'Could not find restaurant' };
      const dish = await this.dishes.save(
        this.dishes.create({
          ...createDishInput,
          restaurant,
        }),
      );
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not create dish' };
    }
  }
}
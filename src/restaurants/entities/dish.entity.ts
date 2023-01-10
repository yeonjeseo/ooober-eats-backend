import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsNumber, IsString, Length } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
class DishOption {
  @Field((type) => String)
  name: string;

  @Field((type) => [String], { nullable: true })
  choices?: string[];

  @Field((type) => Number)
  extra: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field((is) => String)
  @Column({ unique: true })
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Number)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo: string;

  @Field((type) => String)
  @Column()
  @Length(5, 14)
  description: string;

  @Field((type) => Restaurant, { nullable: true })
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  // MySQL, postgres 에서 지원하는 데이터 타입
  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
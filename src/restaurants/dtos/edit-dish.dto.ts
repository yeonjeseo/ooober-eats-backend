import {Field, InputType, ObjectType, PartialType, PickType} from '@nestjs/graphql';
import { Dish } from '../entities/dish.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
  'name',
  'options',
  'price',
  'name',
  'description',
]) {
  @Field(type => Number)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends CoreOutput {}
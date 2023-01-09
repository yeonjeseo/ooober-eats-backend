import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantInputType } from './create-restaurant.dto';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class EditRestaurantInput extends PartialType(
  CreateRestaurantInputType,
) {}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
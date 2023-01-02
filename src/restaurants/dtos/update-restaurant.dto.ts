import {ArgsType, Field, InputType, PartialType} from "@nestjs/graphql";
import {Restaurant} from "../entities/restanrant.entity";


@InputType()
class UpdateRestaurantInputType extends PartialType(Restaurant) {};

/**
 * UPDATE 를 하기 위해서는 Id가 반드시 있어야 함. 식별을 해야 하니까.
 * Entity 의 Partial Type과, id를 별개로 받는 새로운 타입을 생성해서 Dto로 사용
 */
@InputType()
export class UpdateRestaurantDto {
    @Field(type => Number)
    id: number;

    @Field(type => UpdateRestaurantInputType)
    data: UpdateRestaurantInputType
}
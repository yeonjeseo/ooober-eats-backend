import {InputType, Field, ArgsType, OmitType} from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import {Restaurant} from "../entities/restanrant.entity";

/**
 * InputType은 alias가 필수임 대신 argsType을 사용하면 별ㅊ핑 없이 입력 받을 수 있음
 * InputType은 객체 타입
 * ArgsType은 분리된 키로 데이터 전송 가능
 */

/**
 * validator를 쓰기 위해선 validation - pipe를 써야 함
 */
// @ArgsType()
// export class CreateRestaurantDto {
//   @Field((type) => String)
//   @IsString()
//   @Length(5, 10)
//   name: string;
//   @Field((type) => Boolean)
//   @IsBoolean()
//   isVegan: boolean;
//   @Field((type) => String)
//   @IsString()
//   address: string;
//   @Field((type) => String)
//   @IsString()
//   ownersName: string;
//   @Field((type) => String)
//   @IsString()
//   categoryName: string;
// }

/**
 * Restaurant는 Object 타입인데,
 * OmitType은 InputType만 받게 되어 있음
 * MappedTypes의  마지막  매개변수로 변환하고자 하는 데코레이터로 변환 가능
 */
@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ["id"], InputType ) {}
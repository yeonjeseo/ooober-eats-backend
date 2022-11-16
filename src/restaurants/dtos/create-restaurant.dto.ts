import {InputType, Field, ArgsType} from "@nestjs/graphql";
import {IsBoolean, IsString, Length} from "class-validator";

/**
 * InputType은 alias가 필수임 대신 argsType을 사용하면 별ㅊ핑 없이 입력 받을 수 있음
 * InputType은 객체 타입
 * ArgsType은 분리된 키로 데이터 전송 가능
 */

/**
 * validator를 쓰기 위해선 validation - pipe를 써야 함
 */
// @InputType()
@ArgsType()
export class CreateRestaurantDto {
    @Field(type => String)
    @IsString()
    @Length(5, 10)
    name: string
    @Field(type=> Boolean)
    @IsBoolean()
    isVegan: boolean
    @Field(type => String)
    @IsString()
    address: string
    @Field(쇼ㅔㄷ => String)
    @IsString()
    ownersName: string
}
import {InputType, Field, ArgsType} from "@nestjs/graphql";

/**
 * InputType은 alias가 필수임 대신 argsType을 사용하면 별ㅊ핑 없이 입력 받을 수 있음
 * InputType은 객체 타입
 * ArgsType은 분리된 키로 데이터 전송 가능
 */
// @InputType()
@ArgsType()
export class CreateRestaurantDto {
    @Field(type => String)
    name: string
    @Field(type=> Boolean)
    isVegan: boolean
    @Field(type => String)
    address: string
    @Field(쇼ㅔㄷ => String)
    ownersName: string
}
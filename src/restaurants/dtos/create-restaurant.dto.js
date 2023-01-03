"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateRestaurantDto = void 0;
var graphql_1 = require("@nestjs/graphql");
var restanrant_entity_1 = require("../entities/restanrant.entity");
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
var CreateRestaurantDto = /** @class */ (function (_super) {
    __extends(CreateRestaurantDto, _super);
    function CreateRestaurantDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreateRestaurantDto = __decorate([
        (0, graphql_1.InputType)()
    ], CreateRestaurantDto);
    return CreateRestaurantDto;
}((0, graphql_1.OmitType)(restanrant_entity_1.Restaurant, ['id'], graphql_1.InputType)));
exports.CreateRestaurantDto = CreateRestaurantDto;

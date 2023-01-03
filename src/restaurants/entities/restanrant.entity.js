"use strict";
/**
 * 엔티티
 * 우리 데이터베이스 모델
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Restaurant = void 0;
var graphql_1 = require("@nestjs/graphql");
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
/**
 * Most of the definitions in a GraphQL schema are object types.
 * Each object type you define should represent a domain object that an application client might need to interact with.
 * For example, our sample API needs to be able to fetch a list of authors and their posts, so we should define the Author type and Post type to support this functionality.
 */
/**
 * 하나의 클래스를 ObjectType, Entity 사용할 수 있다,
 */
/**
 * Mappped Types - 베이스 타입을 바탕으로 다른 버전을 만들 수 있다.
 */
var Restaurant = /** @class */ (function () {
    function Restaurant() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        (0, graphql_1.Field)(function (is) { return Number; })
    ], Restaurant.prototype, "id");
    __decorate([
        (0, graphql_1.Field)(function (is) { return String; }),
        (0, typeorm_1.Column)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(5)
    ], Restaurant.prototype, "name");
    __decorate([
        (0, graphql_1.Field)(function (is) { return Boolean; }, { nullable: true }),
        (0, typeorm_1.Column)({ "default": true }),
        (0, class_validator_1.IsBoolean)(),
        (0, class_validator_1.IsOptional)()
    ], Restaurant.prototype, "isVegan");
    __decorate([
        (0, graphql_1.Field)(function (type) { return String; }, { defaultValue: '경북 문경시 모전동 신원아침도시' }),
        (0, typeorm_1.Column)(),
        (0, class_validator_1.IsString)()
    ], Restaurant.prototype, "address");
    __decorate([
        (0, graphql_1.Field)(function (type) { return String; }),
        (0, typeorm_1.Column)(),
        (0, class_validator_1.IsString)()
    ], Restaurant.prototype, "ownersName");
    __decorate([
        (0, graphql_1.Field)(function (is) { return String; }),
        (0, typeorm_1.Column)(),
        (0, class_validator_1.IsString)()
    ], Restaurant.prototype, "categoryName");
    Restaurant = __decorate([
        (0, graphql_1.InputType)({ isAbstract: true }),
        (0, graphql_1.ObjectType)(),
        (0, typeorm_1.Entity)()
    ], Restaurant);
    return Restaurant;
}());
exports.Restaurant = Restaurant;

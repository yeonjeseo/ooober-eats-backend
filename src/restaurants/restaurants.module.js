"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RestaurantsModule = void 0;
var common_1 = require("@nestjs/common");
var restaurants_resolver_1 = require("./restaurants.resolver");
var typeorm_1 = require("@nestjs/typeorm");
var restanrant_entity_1 = require("./entities/restanrant.entity");
var restaurants_service_1 = require("./restaurants.service");
/**
 * forFeature는 TypeOrmModule이 특정 Feature 를 import 할 수 있도록 해줌
 *
 */
var RestaurantsModule = /** @class */ (function () {
    function RestaurantsModule() {
    }
    RestaurantsModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([restanrant_entity_1.Restaurant])],
            providers: [restaurants_resolver_1.RestaurantResolver, restaurants_service_1.RestaurantService]
        })
    ], RestaurantsModule);
    return RestaurantsModule;
}());
exports.RestaurantsModule = RestaurantsModule;

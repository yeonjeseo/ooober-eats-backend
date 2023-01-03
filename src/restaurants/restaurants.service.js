"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.RestaurantService = void 0;
var common_1 = require("@nestjs/common");
var restanrant_entity_1 = require("./entities/restanrant.entity");
var typeorm_1 = require("@nestjs/typeorm");
/**
 * RrestaurantService를 RestaurantResolvers에 Inject
 */
var RestaurantService = /** @class */ (function () {
    function RestaurantService(restaurants) {
        this.restaurants = restaurants;
    }
    RestaurantService.prototype.getAll = function () {
        return this.restaurants.find();
    };
    RestaurantService.prototype.createRestaurant = function (createRestaurantDto) {
        // 여기서의 restaurants.create() DB에 레코드를 저장하지 않고 Nodejs 메모리에 임시 적재하는 클래스 인스턴스임. db에 저장하고 싶다면 .save() 메서드를 써야 함.
        var newRestaurant = this.restaurants.create(createRestaurantDto);
        return this.restaurants.save(newRestaurant);
    };
    RestaurantService.prototype.updateRestaurant = function (_a) {
        var id = _a.id, data = _a.data;
        // DB에 레코드가 존재하는지 확인하지 않
        return this.restaurants.update(id, __assign({}, data));
    };
    RestaurantService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(restanrant_entity_1.Restaurant))
    ], RestaurantService);
    return RestaurantService;
}());
exports.RestaurantService = RestaurantService;

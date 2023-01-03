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
exports.UpdateRestaurantDto = void 0;
var graphql_1 = require("@nestjs/graphql");
var restanrant_entity_1 = require("../entities/restanrant.entity");
var UpdateRestaurantInputType = /** @class */ (function (_super) {
    __extends(UpdateRestaurantInputType, _super);
    function UpdateRestaurantInputType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateRestaurantInputType = __decorate([
        (0, graphql_1.InputType)()
    ], UpdateRestaurantInputType);
    return UpdateRestaurantInputType;
}((0, graphql_1.PartialType)(restanrant_entity_1.Restaurant)));
/**
 * UPDATE 를 하기 위해서는 Id가 반드시 있어야 함. 식별을 해야 하니까.
 * Entity 의 Partial Type과, id를 별개로 받는 새로운 타입을 생성해서 Dto로 사용
 */
var UpdateRestaurantDto = /** @class */ (function () {
    function UpdateRestaurantDto() {
    }
    __decorate([
        (0, graphql_1.Field)(function (type) { return Number; })
    ], UpdateRestaurantDto.prototype, "id");
    __decorate([
        (0, graphql_1.Field)(function (type) { return UpdateRestaurantInputType; })
    ], UpdateRestaurantDto.prototype, "data");
    UpdateRestaurantDto = __decorate([
        (0, graphql_1.InputType)()
    ], UpdateRestaurantDto);
    return UpdateRestaurantDto;
}());
exports.UpdateRestaurantDto = UpdateRestaurantDto;

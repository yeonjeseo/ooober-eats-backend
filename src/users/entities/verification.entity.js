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
exports.Verification = void 0;
var graphql_1 = require("@nestjs/graphql");
var typeorm_1 = require("typeorm");
var core_entity_1 = require("../../common/entities/core.entity");
var users_entity_1 = require("./users.entity");
var uuid_1 = require("uuid");
var Verification = /** @class */ (function (_super) {
    __extends(Verification, _super);
    function Verification() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Verification.prototype.createCode = function () {
        this.code = (0, uuid_1.v4)();
    };
    __decorate([
        (0, typeorm_1.Column)(),
        (0, graphql_1.Field)(function (type) { return String; })
    ], Verification.prototype, "code");
    __decorate([
        (0, typeorm_1.OneToOne)(function (type) { return users_entity_1.User; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)()
    ], Verification.prototype, "user");
    __decorate([
        (0, typeorm_1.BeforeInsert)()
    ], Verification.prototype, "createCode");
    Verification = __decorate([
        (0, graphql_1.InputType)({ isAbstract: true }),
        (0, graphql_1.ObjectType)(),
        (0, typeorm_1.Entity)()
    ], Verification);
    return Verification;
}(core_entity_1.CoreEntity));
exports.Verification = Verification;

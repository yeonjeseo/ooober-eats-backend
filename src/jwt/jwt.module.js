"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JwtModule = void 0;
var common_1 = require("@nestjs/common");
var jwt_service_1 = require("./jwt.service");
var common_constants_1 = require("../common/common.constants");
var JwtModule = /** @class */ (function () {
    function JwtModule() {
    }
    JwtModule_1 = JwtModule;
    JwtModule.forRoot = function (options) {
        return {
            module: JwtModule_1,
            providers: [
                {
                    provide: common_constants_1.CONFIG_OPTIONS,
                    useValue: options
                },
                jwt_service_1.JwtService,
            ],
            exports: [jwt_service_1.JwtService]
        };
    };
    var JwtModule_1;
    JwtModule = JwtModule_1 = __decorate([
        (0, common_1.Module)({})
        // nest global module로 설정할 수 있음.
        ,
        (0, common_1.Global)()
    ], JwtModule);
    return JwtModule;
}());
exports.JwtModule = JwtModule;

"use strict";
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
exports.JwtService = void 0;
var common_1 = require("@nestjs/common");
var common_constants_1 = require("../common/common.constants");
var jwt = require("jsonwebtoken");
var JwtService = /** @class */ (function () {
    function JwtService(options) {
        this.options = options;
    }
    JwtService.prototype.sign = function (userId) {
        return jwt.sign({ id: userId }, this.options.privateKey);
    };
    JwtService.prototype.verify = function (token) {
        return jwt.verify(token, this.options.privateKey);
    };
    JwtService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, common_1.Inject)(common_constants_1.CONFIG_OPTIONS))
    ], JwtService);
    return JwtService;
}());
exports.JwtService = JwtService;

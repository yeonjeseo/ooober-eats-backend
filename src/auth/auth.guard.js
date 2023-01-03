"use strict";
/**
 * Guard : request를 다음 단계로 진행 시킬지 마맂 결정
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthGuard = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
var AuthGuard = /** @class */ (function () {
    function AuthGuard() {
    }
    /**
     * http 실행 컨텍스트를 gql 실행 컨텍스트로 변환하는 과정이 필요함.
     */
    AuthGuard.prototype.canActivate = function (context) {
        var gqlContext = graphql_1.GqlExecutionContext.create(context).getContext();
        var user = gqlContext.user;
        if (!user)
            return false;
        return true;
    };
    AuthGuard = __decorate([
        (0, common_1.Injectable)()
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;

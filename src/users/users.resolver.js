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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UsersResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var users_entity_1 = require("./entities/users.entity");
var graphql_2 = require("@nestjs/graphql");
var create_account_dto_1 = require("./dtos/create-account.dto");
var login_dto_1 = require("./dtos/login.dto");
var common_1 = require("@nestjs/common");
var auth_guard_1 = require("../auth/auth.guard");
var auth_user_decorator_1 = require("../auth/auth-user.decorator");
var user_profile_dto_1 = require("./dtos/user-profile.dto");
var edit_profile_dto_1 = require("./dtos/edit-profile.dto");
var verify_eamil_dto_1 = require("./dtos/verify-eamil.dto");
var UsersResolver = /** @class */ (function () {
    function UsersResolver(usersService) {
        this.usersService = usersService;
    }
    UsersResolver.prototype.createAccount = function (createAccountInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.createAccount(createAccountInput)];
            });
        });
    };
    UsersResolver.prototype.login = function (loginInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.login(loginInput)];
            });
        });
    };
    UsersResolver.prototype.me = function (authUser) {
        return authUser;
    };
    UsersResolver.prototype.userProfile = function (userProfileInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.findById(userProfileInput.userId)];
            });
        });
    };
    UsersResolver.prototype.editProfile = function (authUser, editProfileInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.editProfile(authUser.id, editProfileInput)];
            });
        });
    };
    UsersResolver.prototype.verifyEmail = function (verifyEmailInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersService.verifyEmail(verifyEmailInput.code)];
            });
        });
    };
    __decorate([
        (0, graphql_2.Mutation)(function (returns) { return create_account_dto_1.CreateAccountOutput; }),
        __param(0, (0, graphql_1.Args)('input'))
    ], UsersResolver.prototype, "createAccount");
    __decorate([
        (0, graphql_2.Mutation)(function (returns) { return login_dto_1.LoginOutput; }),
        __param(0, (0, graphql_1.Args)('input'))
    ], UsersResolver.prototype, "login");
    __decorate([
        (0, graphql_2.Query)(function (returns) { return users_entity_1.User; }),
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        __param(0, (0, auth_user_decorator_1.AuthUser)())
    ], UsersResolver.prototype, "me");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        (0, graphql_2.Query)(function (returns) { return user_profile_dto_1.UserProfileOutput; }),
        __param(0, (0, graphql_1.Args)())
    ], UsersResolver.prototype, "userProfile");
    __decorate([
        (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
        (0, graphql_2.Mutation)(function (returns) { return edit_profile_dto_1.EditProfileOutput; }),
        __param(0, (0, auth_user_decorator_1.AuthUser)()),
        __param(1, (0, graphql_1.Args)('input'))
    ], UsersResolver.prototype, "editProfile");
    __decorate([
        (0, graphql_2.Mutation)(function (returns) { return verify_eamil_dto_1.VerifyEmailOutput; }),
        __param(0, (0, graphql_1.Args)('input'))
    ], UsersResolver.prototype, "verifyEmail");
    UsersResolver = __decorate([
        (0, graphql_1.Resolver)(function (of) { return users_entity_1.User; })
    ], UsersResolver);
    return UsersResolver;
}());
exports.UsersResolver = UsersResolver;

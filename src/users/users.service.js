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
exports.UsersService = void 0;
var typeorm_1 = require("@nestjs/typeorm");
var users_entity_1 = require("./entities/users.entity");
var common_1 = require("@nestjs/common");
var verification_entity_1 = require("./entities/verification.entity");
var UsersService = /** @class */ (function () {
    /**
     * Dependency Injection
     */
    function UsersService(users, verifications, jwtService) {
        this.users = users;
        this.verifications = verifications;
        this.jwtService = jwtService;
    }
    UsersService.prototype.createAccount = function (_a) {
        var email = _a.email, password = _a.password, role = _a.role;
        return __awaiter(this, void 0, void 0, function () {
            var exists, user, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.users.findOne({ where: { email: email } })];
                    case 1:
                        exists = _b.sent();
                        // const exists = await this.users.findOne({email})
                        if (exists) {
                            // make error
                            return [2 /*return*/, {
                                    ok: false,
                                    error: 'There is a user with that email already'
                                }];
                        }
                        return [4 /*yield*/, this.users.save(this.users.create({ email: email, password: password, role: role }))];
                    case 2:
                        user = _b.sent();
                        return [4 /*yield*/, this.verifications.save(this.verifications.create({
                                user: user
                            }))];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, {
                                ok: true
                            }];
                    case 4:
                        e_1 = _b.sent();
                        console.log(e_1);
                        return [2 /*return*/, {
                                ok: false,
                                error: "Couldn't created account"
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.login = function (_a) {
        var email = _a.email, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var user, passwordCorrect, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.users.findOne({
                                where: { email: email },
                                select: ['password', 'id']
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user)
                            return [2 /*return*/, {
                                    ok: false,
                                    error: 'User not found'
                                }];
                        return [4 /*yield*/, user.checkPassword(password)];
                    case 2:
                        passwordCorrect = _b.sent();
                        if (!passwordCorrect)
                            return [2 /*return*/, {
                                    ok: false,
                                    error: 'Wrong password!'
                                }];
                        /**
                         * process.env를 사용하는 것이 아니라 Nest 적인 방법을 사용할 것
                         * users.module
                         *
                         */
                        return [2 /*return*/, {
                                ok: true,
                                token: this.jwtService.sign(user.id)
                            }];
                    case 3:
                        e_2 = _b.sent();
                        return [2 /*return*/, {
                                ok: false,
                                error: e_2
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.users.findOne({ where: { id: id } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw Error();
                        return [2 /*return*/, {
                                ok: Boolean(user),
                                user: user
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, {
                                ok: false,
                                error: error_1
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.editProfile = function (userId, _a) {
        var email = _a.email, password = _a.password;
        return __awaiter(this, void 0, void 0, function () {
            var user, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.users.findOne({ where: { id: userId } })];
                    case 1:
                        user = _b.sent();
                        if (!email) return [3 /*break*/, 3];
                        user.email = email;
                        user.verified = false;
                        return [4 /*yield*/, this.verifications.save(this.verifications.create({ user: user }))];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (password)
                            user.password = password;
                        return [4 /*yield*/, this.users.save(user)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, {
                                ok: true
                            }];
                    case 5:
                        error_2 = _b.sent();
                        return [2 /*return*/, { ok: false, error: error_2 }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.verifyEmail = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var verification, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.verifications.findOne({
                                where: { code: code },
                                relations: ['user']
                            })];
                    case 1:
                        verification = _a.sent();
                        if (!verification)
                            throw Error();
                        verification.user.verified = true;
                        return [4 /*yield*/, this.users.save(verification.user)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.verifications["delete"](verification.id)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { ok: true }];
                    case 4:
                        error_3 = _a.sent();
                        return [2 /*return*/, { ok: false, error: error_3 }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
        __param(1, (0, typeorm_1.InjectRepository)(verification_entity_1.Verification))
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;

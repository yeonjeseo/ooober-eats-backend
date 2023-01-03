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
exports.MailService = void 0;
var common_1 = require("@nestjs/common");
var common_constants_1 = require("../common/common.constants");
var got_1 = require("got");
var MailService = /** @class */ (function () {
    function MailService(options) {
        this.options = options;
    }
    MailService.prototype.sendEmail = function (subject, content) {
        (0, got_1["default"])("https://api.mailgun.net/v3/".concat(this.options.emailDomain, "/messages"), {
            headers: {
                Authorization: "Basic ".concat(Buffer.from("api:".concat(this.options.apiKey)).toString('base64'))
            }
        });
    };
    MailService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, common_1.Inject)(common_constants_1.CONFIG_OPTIONS))
    ], MailService);
    return MailService;
}());
exports.MailService = MailService;

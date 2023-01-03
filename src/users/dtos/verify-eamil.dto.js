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
exports.VerifyEmailInput = exports.VerifyEmailOutput = void 0;
var output_dto_1 = require("../../common/dtos/output.dto");
var graphql_1 = require("@nestjs/graphql");
var verification_entity_1 = require("../entities/verification.entity");
var VerifyEmailOutput = /** @class */ (function (_super) {
    __extends(VerifyEmailOutput, _super);
    function VerifyEmailOutput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerifyEmailOutput = __decorate([
        (0, graphql_1.ObjectType)()
    ], VerifyEmailOutput);
    return VerifyEmailOutput;
}(output_dto_1.CoreOutput));
exports.VerifyEmailOutput = VerifyEmailOutput;
var VerifyEmailInput = /** @class */ (function (_super) {
    __extends(VerifyEmailInput, _super);
    function VerifyEmailInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerifyEmailInput = __decorate([
        (0, graphql_1.InputType)()
    ], VerifyEmailInput);
    return VerifyEmailInput;
}((0, graphql_1.PickType)(verification_entity_1.Verification, ['code'])));
exports.VerifyEmailInput = VerifyEmailInput;

"use strict";
exports.__esModule = true;
exports.AuthUser = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
/**
 * factory function
 */
exports.AuthUser = (0, common_1.createParamDecorator)(function (data, context) {
    var gqlContext = graphql_1.GqlExecutionContext.create(context).getContext();
    var user = gqlContext.user;
    return user;
});

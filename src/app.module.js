"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
var apollo_1 = require("@nestjs/apollo");
var typeorm_1 = require("@nestjs/typeorm");
var config_1 = require("@nestjs/config");
var Joi = require("joi");
var users_module_1 = require("./users/users.module");
var users_entity_1 = require("./users/entities/users.entity");
var jwt_module_1 = require("./jwt/jwt.module");
var jwt_middleware_1 = require("./jwt/jwt.middleware");
var auth_module_1 = require("./auth/auth.module");
var verification_entity_1 = require("./users/entities/verification.entity");
var mail_module_1 = require("./mail/mail.module");
/**
 * forRoot?
 *  TypeORM module 안에 Restaurant라 하는 Entity를 가지고 있음
 */
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) {
        consumer.apply(jwt_middleware_1.jwtMiddleware).forRoutes({
            path: '/graphql',
            // path: '*', // 모든 경로에 (wild card)
            method: common_1.RequestMethod.ALL
        });
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
                    ignoreEnvFile: process.env.Node_ENV === 'prod',
                    validationSchema: Joi.object({
                        NODE_ENV: Joi.string().required().valid('dev', 'test', 'prod'),
                        DB_HOST: Joi.string().required(),
                        DB_PORT: Joi.string().required(),
                        DB_USERNAME: Joi.string().required(),
                        DB_PASSWORD: Joi.string().required(),
                        DB_DATABASE: Joi.string().required(),
                        JWT_SECRET: Joi.string().required(),
                        MAILGUN_URL: Joi.string().required(),
                        MAILGUN_AKI_KEY: Joi.string().required(),
                        MAILGUN_FROM_EMAIL: Joi.string().required()
                    })
                }),
                /**
                 * Apollo Server 나 Graphql context 는 모든 resolver에 정보를 보낼 수 있는 Property
                 * 모든 request에 대해서 context binding이 이뤄짐
                 * context 속성의 함수 매개변수는 request
                 */
                graphql_1.GraphQLModule.forRoot({
                    driver: apollo_1.ApolloDriver,
                    autoSchemaFile: true,
                    context: function (_a) {
                        var req = _a.req;
                        return ({ user: req['user'] });
                    }
                }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: +process.env.DB_PORT,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    entities: [users_entity_1.User, verification_entity_1.Verification],
                    synchronize: process.env.Node_ENV !== 'prod',
                    logging: true
                }),
                users_module_1.UsersModule,
                jwt_module_1.JwtModule.forRoot({
                    privateKey: process.env.JWT_SECRET
                }),
                auth_module_1.AuthModule,
                mail_module_1.MailModule.forRoot({
                    apiKey: process.env.MAILGUN_URL,
                    fromEmail: process.env.MAILGUN_AKI_KEY,
                    emailDomain: process.env.MAILGUN_FROM_EMAIL
                }),
            ],
            controllers: [],
            providers: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;

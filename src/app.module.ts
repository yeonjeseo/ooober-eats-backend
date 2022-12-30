import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver } from '@nestjs/apollo';
import {RestaurantsModule} from "./restaurants/restaurants.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import * as Joi from 'joi'
import {Restaurant} from "./restaurants/entities/restanrant.entity";
/**
 * forRoot?
 */

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: process.env.NODE_ENV === 'dev' ? ".env.dev" : '.env.test',
        ignoreEnvFile: process.env.Node_ENV === 'prod',
        validationSchema: Joi.object({
          NODE_ENV: Joi.string().required().valid('dev', 'test', 'prod'),
          DB_HOST: Joi.string().required(),
          DB_PORT: Joi.string().required(),
          DB_USERNAME: Joi.string().required(),
          DB_PASSWORD: Joi.string().required(),
          DB_DATABASE: Joi.string().required(),
        }),

      }),GraphQLModule.forRoot({
    driver: ApolloDriver,
    autoSchemaFile: true,
  }),
    RestaurantsModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port:  +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Restaurant],
    synchronize: process.env.Node_ENV !== 'prod',  // DB를 현재 모듈 상태로 동기화
    logging: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
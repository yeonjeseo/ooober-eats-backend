import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver } from '@nestjs/apollo';
import {RestaurantsModule} from "./restaurants/restaurants.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
/**
 * forRoot?
 */
@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: process.env.NODE_ENV === 'dev' ? ".env.dev" : '.env.test',
        ignoreEnvFile: process.env.Node_ENV === 'prod'
      }),GraphQLModule.forRoot({
    driver: ApolloDriver,
    autoSchemaFile: true,
  }),
    RestaurantsModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port:  +process.env.DB_PORT,
    password: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    entities: [],
    synchronize: true,  // DB를 현재 모듈 상태로 동기화
    logging: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
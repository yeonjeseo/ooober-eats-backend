import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver } from '@nestjs/apollo';
import {RestaurantsModule} from "./restaurants/restaurants.module";
import {TypeOrmModule} from "@nestjs/typeorm";
/**
 * forRoot?
 */
@Module({
  imports: [GraphQLModule.forRoot({
    driver: ApolloDriver,
    autoSchemaFile: true,
  }),
    RestaurantsModule,
  TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "jeffrey",
    password: "admin",
    database: "ooober-eats",
    entities: [],
    synchronize: true,  // DB를 현재 모듈 상태로 동기화
    logging: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
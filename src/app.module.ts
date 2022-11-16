import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {join} from 'path'
import {RestaurantsModule} from "./restaurants/restaurants.module";
/**
 * forRoot?
 */
@Module({
  imports: [GraphQLModule.forRoot({
    driver: ApolloDriver,
    autoSchemaFile: true,
  }), RestaurantsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
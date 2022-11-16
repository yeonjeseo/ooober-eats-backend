/**
 * 엔티티
 * 우리 데이터베이스 모델
 */

import {Field, ObjectType} from "@nestjs/graphql";

/**
 * Most of the definitions in a GraphQL schema are object types.
 * Each object type you define should represent a domain object that an application client might need to interact with.
 * For example, our sample API needs to be able to fetch a list of authors and their posts, so we should define the Author type and Post type to support this functionality.
 */
@ObjectType()
export class Restaurant {
    @Field(is => String)
    name: string;

    @Field(is => Boolean, {nullable: true})
    isGood: boolean;
}
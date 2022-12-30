/**
 * 엔티티
 * 우리 데이터베이스 모델
 */

import {Field, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Most of the definitions in a GraphQL schema are object types.
 * Each object type you define should represent a domain object that an application client might need to interact with.
 * For example, our sample API needs to be able to fetch a list of authors and their posts, so we should define the Author type and Post type to support this functionality.
 */

/**
 * 하나의 클래스를 ObjectType, Entity 사용할 수 있다,
 */
@ObjectType()
@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    @Field(is => Number)
    id: number

    @Field(is => String)
    @Column()
    name: string;

    @Field(is => Boolean)
    @Column()
    isVegan: boolean;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    ownersName: string;
}
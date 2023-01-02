/**
 * 엔티티
 * 우리 데이터베이스 모델
 */

import {Field, InputType, ObjectType} from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsBoolean, IsOptional, IsString, Length} from "class-validator";

/**
 * Most of the definitions in a GraphQL schema are object types.
 * Each object type you define should represent a domain object that an application client might need to interact with.
 * For example, our sample API needs to be able to fetch a list of authors and their posts, so we should define the Author type and Post type to support this functionality.
 */

/**
 * 하나의 클래스를 ObjectType, Entity 사용할 수 있다,
 */

/**
 * Mappped Types - 베이스 타입을 바탕으로 다른 버전을 만들 수 있다.
 */
@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((is) => Number)
  id: number;

  @Field((is) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  // 각각의 데코레이터가 알아먹을 수 있도록 적절한 옵션 추가해서 Default value 설정
  // graphql -> Nullable, defaultValue
  @Field((is) => Boolean, {nullable: true})
  @Column({default: true})
  @IsBoolean()
  @IsOptional()
  isVegan: boolean;

  @Field((type) => String, {defaultValue: '경북 문경시 모전동 신원아침도시'})
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  ownersName: string;

  @Field((is) => String)
  @Column()
  @IsString()
  categoryName: string;
}
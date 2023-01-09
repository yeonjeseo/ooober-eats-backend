import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export enum UserRole {
  Owner = 'Owner',
  Client = 'Client',
  Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ select: false })
  @IsString()
  password: string;

  @Field((type) => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field((type) => [Restaurant]) // Graphql notation
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];
  /**
   * Entity Listener
   * "특정 Entity event 를 Listen 하는 사용자 로직이 있는 method 를 가질 수 있다.
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(plain: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plain, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
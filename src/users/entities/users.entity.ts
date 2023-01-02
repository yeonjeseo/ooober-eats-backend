import {BeforeInsert, Column, Entity} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import * as bcrypt from 'bcrypt'
import {InternalServerErrorException} from "@nestjs/common";
import {IsEmail, IsEnum} from "class-validator";
enum UserRole {
    Owner,
    Client,
    Delivery
}

registerEnumType(UserRole, {name: 'UserRole'})

@InputType({isAbstract: true})
@Entity()
@ObjectType()
export class User extends CoreEntity {
    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;

    @Field(type => String)
    @Column()
    password: string;

    @Field(type => UserRole)
    @Column({type: 'enum', enum: UserRole})
    @IsEnum(UserRole)
    role: UserRole;

    /**
     * Entity Listener
     * "특정 Entity event 를 Listen 하는 사용자 로직이 있는 method 를 가질 수 있다.
     */
    @BeforeInsert()
    async hashPassword () : Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10)
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async checkPassword (plain: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plain, this.password)
        }catch (e) {
            console.log(e)
            throw new InternalServerErrorException();
        }
    }
}
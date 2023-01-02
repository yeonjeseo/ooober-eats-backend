import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from './entities/users.entity'
import {UsersResolver} from "./users.resolver";
import {UsersService} from "./users.service";
import { ConfigService} from "@nestjs/config";
import {JwtService} from "../jwt/jwt.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersResolver, UsersService, ConfigService]
})
export class UsersModule {}
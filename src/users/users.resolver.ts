import {Resolver} from "@nestjs/graphql";
import {UsersService} from "./users.service";
import {User} from "./entities/users.entity";
import {Query} from "@nestjs/graphql";

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {
    }

    @Query(returns => Boolean)
    hi() {
        return true;
    }
}
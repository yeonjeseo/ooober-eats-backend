import {Args, Context, Resolver} from "@nestjs/graphql";
import {UsersService} from "./users.service";
import {User} from "./entities/users.entity";
import {Query, Mutation} from "@nestjs/graphql";
import {CreateAccountInput, CreateAccountOutput} from "./dtos/create-account.dto";
import {LoginInput, LoginOutput} from "./dtos/login.dto";
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "../auth/auth.guard";
import {AuthUser} from "../auth/auth-user.decorator";

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {
    }

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            return  this.usersService.createAccount(createAccountInput)
        }catch (e) {
            console.log(e)
            return {error: e, ok: false}
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            return this.usersService.login(loginInput);
        }catch (e) {
            console.log(e)
            return {error: e, ok: false}
        }
    }

    @Query(returns => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
        try {
            console.log(authUser)
            return authUser
        }catch (e) {
        }
    }

}
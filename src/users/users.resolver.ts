import {Args, Resolver} from "@nestjs/graphql";
import {UsersService} from "./users.service";
import {User} from "./entities/users.entity";
import {Query, Mutation} from "@nestjs/graphql";
import {CreateAccountInput, CreateAccountOutput} from "./dtos/create-account.dto";
import {LoginInput, LoginOutput} from "./dtos/login.dto";

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
            const error =await this.usersService.createAccount(createAccountInput)
            if(error) {
                return {error: error, ok: false}
            }
            return {
                ok: true,
            }
        }catch (e) {
            console.log(e)
            return {error: e, ok: false}
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
        console.log(loginInput)

        return {
            ok: true,
            token: "asd"
        }
    }catch (e) {
        console.log(e)
        return {error: e, ok: false}
    }
    }
}
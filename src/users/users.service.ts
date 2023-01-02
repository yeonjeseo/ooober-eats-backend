import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm'
import {User} from "./entities/users.entity";
import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {CreateAccountInput, CreateAccountOutput} from "./dtos/create-account.dto";
import {LoginInput, LoginOutput} from "./dtos/login.dto";
// import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {ConfigModule, ConfigService} from "@nestjs/config";
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly users: Repository<User>,
                private readonly config: ConfigService) {
        console.log(this.config.get('JWT_SECRET'))
    }

    async createAccount({email, password, role}: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
        // check if email exist
        // hash password & create user
            const exists = await this.users.findOne({where: {email}})

            // const exists = await this.users.findOne({email})
            if(exists) {
                // make error
                return {
                    ok: false,
                    error: "There is a user with that email already"
                };
            }
            await this.users.save(this.users.create({email, password, role}))
        }catch (e) {
            console.log(e)
            return {
                ok: false,
                error: "Couldn't created account"
            }
        }
    }

    async login({email, password}: LoginInput): Promise<LoginOutput> {
        try {
            // find the user with the email
            // check if the password is correct
            // make a JWT and git it to the user
            const user = await this.users.findOne({where: {email}});
            if(!user) return {
                ok: false,
                error: 'User not found'
            }

            const passwordCorrect = await user.checkPassword(password);
            if(!passwordCorrect) return {
                ok: false,
                error: 'Wrong password!'
            }

            /**
             * process.env를 사용하는 것이 아니라 Nest 적인 방법을 사용할 것
             * users.module
             *
             */
            return {
                ok: true,
                token: jwt.sign({id: user.id}, this.config.get('JWT_SECRET'))
            }
        }catch (e) {
            return {
                ok: false,
                error: e
            }
        }
    }

}
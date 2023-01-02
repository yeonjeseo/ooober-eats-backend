import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm'
import {User} from "./entities/users.entity";
import {Injectable} from "@nestjs/common";
import {CreateAccountInput} from "./dtos/create-account.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

    async createAccount({email, password, role}: CreateAccountInput): Promise<string | undefined> {
        try {
        // check if email exist
        // hash password & create user
            const exists = await this.users.findOne({where: {email}})

            // const exists = await this.users.findOne({email})
            if(exists) {
                // make error
                return "There is a user with that email already";
            }
            await this.users.save(this.users.create({email, password, role}))
        }catch (e) {
            return "Couldn't created account";
        }
    }

}
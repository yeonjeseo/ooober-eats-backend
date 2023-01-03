import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
// import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
@Injectable()
export class UsersService {
  /**
   * Dependency Injection
   */
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      // check if email exist
      // hash password & create user
      const exists = await this.users.findOne({ where: { email } });

      // const exists = await this.users.findOne({email})
      if (exists) {
        // make error
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: "Couldn't created account",
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // find the user with the email
      // check if the password is correct
      // make a JWT and git it to the user
      const user = await this.users.findOne({ where: { email } });
      if (!user)
        return {
          ok: false,
          error: 'User not found',
        };

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect)
        return {
          ok: false,
          error: 'Wrong password!',
        };

      /**
       * process.env를 사용하는 것이 아니라 Nest 적인 방법을 사용할 것
       * users.module
       *
       */
      return {
        ok: true,
        token: this.jwtService.sign(user.id),
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  findById(id: number): Promise<User> {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    // return this.users.update({ id: userId }, { ...editProfileInput });
    const user = await this.users.findOne({ where: { id: userId } });
    if (email) user.email = email;
    if (password) user.password = password;
    return this.users.save(user);
  }
}
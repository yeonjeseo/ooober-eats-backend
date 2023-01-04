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
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-eamil.dto';
import { MailService } from '../mail/mail.service';
@Injectable()
export class UsersService {
  /**
   * Dependency Injection
   */
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );

      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);

      return {
        ok: true,
      };
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
      const user = await this.users.findOne({
        where: { email },
        select: ['password', 'id'],
      });
      if (!user)
        return {
          ok: false,
          error: 'User not found',
        };

      const passwordCorrect = await user.checkPassword(password);
      console.log(passwordCorrect);
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
      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      // findOneOrFail: TypeORM 에서 제공. 레코드 없을 경우 throw
      const user = await this.users.findOneOrFail({ where: { id } });
      return {
        ok: Boolean(user),
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      // return this.users.update({ id: userId }, { ...editProfileInput });
      const user = await this.users.findOne({ where: { id: userId } });
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) user.password = password;
      await this.users.save(user);

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (!verification) throw Error();

      verification.user.verified = true;
      await this.users.save(verification.user);
      await this.verifications.delete(verification.id);

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
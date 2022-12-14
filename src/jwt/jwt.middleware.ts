import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';

// implements는 extends랑 다름
// export class JwtMiddleware implements NestMiddleware {
//     use(req: Request, res: Response, next: NextFunction) {
//         console.log(req.headers.authorization)
//         next();
//     }
// }

/**
 * repository, class, dependency injection 을 사용해야 할 때 Middleware 를 App.use 에 사용할 수 없음.
 *
 */
@Injectable()
export class jwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());

        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user } = await this.usersService.findById(decoded['id']);
          req['user'] = user as User;
        }
      } catch (e) {}
    }
    next();
  }
}
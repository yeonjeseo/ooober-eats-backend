/**
 * Guard : request를 다음 단계로 진행 시킬지 마맂 결정
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { User } from '../users/entities/users.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  /**
   * http 실행 컨텍스트를 gql 실행 컨텍스트로 변환하는 과정이 필요함.
   */
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext.user;
    if (!user) return false;
    if (roles.includes('Any')) return true;

    return roles.includes(user.role);
  }
}

/**
 * metadata가 설정되어있으면, resolver는 public 이 되면 안된다. - role을 확인해봐야 한다.
 */
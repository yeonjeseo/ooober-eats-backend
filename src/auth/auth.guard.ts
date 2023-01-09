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
    if (!roles) return true; // metadata 에 role 이 없다 - public
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext.user;
    if (!user) return false; // metadata 에 role 이 있는데, user 가 없다? - Not allowed
    if (roles.includes('Any')) return true; // metadata 가 any 이다 - 모든 권한에 대해 api 허용

    return roles.includes(user.role); // metadata 권한 리스트에 있는 역할들과 현재 user 의 역할 비교
  }
}

/**
 * metadata가 설정되어있으면, resolver는 public 이 되면 안된다. - role을 확인해봐야 한다.
 */
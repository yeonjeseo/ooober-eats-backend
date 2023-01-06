/**
 * Guard : request를 다음 단계로 진행 시킬지 마맂 결정
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * http 실행 컨텍스트를 gql 실행 컨텍스트로 변환하는 과정이 필요함.
   */
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext.user;
    if (!user) return false;
    return true;
  }
}
/**
 * Guard : request를 다음 단계로 진행 시킬지 마맂 결정
 */

import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user = gqlContext.user
        if(!user) return false;
        return true;
    }
}
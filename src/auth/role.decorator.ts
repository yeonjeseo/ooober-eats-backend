import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entities/users.entity';

// ENUM 타입을 가져올 수 있는 좋은 방법인 듯!
export type AllowedRoles = keyof typeof UserRole | 'Any';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
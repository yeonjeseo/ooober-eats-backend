import { CoreOutput } from '../../common/dtos/output.dto';
import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/users.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

/**
 * PickType 이 User class 에서 property 를 선택하게 해주지만
 * EditProfile 의 경우, email 만, 혹은 password 만, 혹은 둘 다 수정할 수 있음.
 */
// export class EditProfileInput extends PickType(User, ['email', 'password']) {}

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}
import {MutationOutput} from "../../common/dtos/output.dto";
import {Field, InputType, ObjectType, PickType} from "@nestjs/graphql";
import {User} from "../entities/users.entity";

@ObjectType()
export class LoginOutput extends MutationOutput {
    @Field(type => String, {nullable: true})
    token?: string;
}

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}
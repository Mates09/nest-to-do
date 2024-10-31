import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';


export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;


  readonly itemList: [];


  readonly usersAccess: [];


  @IsEmpty({ message: 'You cannot pass user id' })
  readonly userCreated: User;
}
import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';


export class UpdateListDto {
  @IsOptional()
  @IsString()
  readonly name: string;

 

  readonly itemList: [];


  readonly usersAccess: [];



  @IsEmpty({ message: 'You cannot pass user id' })
  readonly userCreated: User;
}
import {
    IsDate,
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    MinDate,


  } from 'class-validator';
  import { User } from '../../auth/schemas/user.schema';
import { Date } from 'mongoose';
  
  
export class UpdateItemDto {
    
    

    
    @IsNotEmpty()
    @IsString()
    readonly title: string;
      
    @IsNotEmpty()
    @IsString()
    readonly text: string;


    @IsNotEmpty()
  
    @MinDate(new Date())
      readonly deadline: string;
      
      @IsNotEmpty()
      readonly status: string;
      
      @IsNotEmpty()
      readonly  listId: string;


    @IsEmpty({ message: 'You cannot pass user id' })
    readonly userCreated: User;
  }
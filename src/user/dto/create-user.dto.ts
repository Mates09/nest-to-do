// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is not valid' })  // Validate email format
  @IsNotEmpty({ message: 'Email is required' })    // Ensure email is provided
  email: string;

  @IsString()                                       // Ensure password is a string
  @IsNotEmpty({ message: 'Password is required' }) // Ensure password is provided
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' }) // Length validation
  password: string;

  @IsString()                                      // Ensure username is a string
  username?: string;                               // Optional username
}
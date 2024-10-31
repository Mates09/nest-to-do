export class CreateAuthDto {}
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'invalid email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}

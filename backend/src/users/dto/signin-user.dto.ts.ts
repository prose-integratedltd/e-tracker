import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninUserDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Please enter your email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter a password' })
  password: string;
}

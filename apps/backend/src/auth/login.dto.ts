import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}

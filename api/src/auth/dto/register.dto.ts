import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 72)
  @Matches(/[A-Z]/, { message: 'Password must contain uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain lowercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain a digit' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain special symbol' })
  password: string;

  @ApiProperty()
  @IsString()
  @Length(1, 128)
  displayName: string;
}

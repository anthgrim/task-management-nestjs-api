import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class UserCredentialsDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(25)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

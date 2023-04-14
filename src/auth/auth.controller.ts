import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dtos/user-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() body: UserCredentialsDto): Promise<void> {
    return this.authService.signUp(body);
  }

  @Post('/signIn')
  signIn(@Body() body: UserCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(body);
  }
}

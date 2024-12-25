import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Auth } from './auth.decorator';
import { AuthType } from './auth-type.enum';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Auth(AuthType.None)
@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // Cookies realization
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(signInDto);

    response.cookie('access_token', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      phone: user.phone,
      status: user.status,
    };

    return { refreshToken, userData };
  }

  @HttpCode(HttpStatus.OK)
  @Post('autologin')
  async autoLogin(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    console.log('- - - - /authentication/autologin');
    const { refreshToken, user } = await this.authService.autoLogin(
      request.cookies['access_token'],
    );

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      phone: user.phone,
      status: user.status,
    };

    return { refreshToken, userData };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');

    return;
  }
}

import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUserData } from '../models/active-user-data.model';
import { HashingService } from '../hashing/hashing.service';
import { UserStatus } from "../../users/entities/user-status.entity";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(UserStatus)
    private readonly userStatusesRepository: Repository<UserStatus>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.username = signUpDto.username;
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      user.roles = [await this.rolesRepository.findOneBy({ name: 'user' })];
      user.name = signUpDto.name;
      user.surname = signUpDto.surname;
      user.patronymic = signUpDto.patronymic;
      user.phone = signUpDto.phone;
      user.status = await this.userStatusesRepository.findOneBy({ id: 1 });

      await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: { email: signInDto.email },
      relations: { roles: true },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не существует!');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Неверный логин/пароль');
    }

    const tokens = await this.generateTokens(user);
    return { ...tokens, user };
  }

  async autoLogin(token: string) {
    const decodedToken: any = this.jwtService.decode(token);
    const user = await this.usersRepository.findOne({
      where: { email: decodedToken.email },
      relations: { roles: true },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не существует!');
    }

    const { refreshToken } = await this.generateTokens(user);
    return { refreshToken, user };
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          roles: user.roles,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersRepository.findOneOrFail({
        where: { id: sub },
        relations: { roles: true },
      });

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}

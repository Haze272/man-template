import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RolesGuard } from './authorization/guards/roles.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    AuthenticationService,
    RolesService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}

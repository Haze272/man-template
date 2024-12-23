import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserStatus } from './entities/user-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserStatus])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

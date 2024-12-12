import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [IamModule, RolesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

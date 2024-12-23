import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { RouterModule } from '@nestjs/core';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT) ?? 3306,
      username: process.env.DATABASE_USER ?? 'root',
      password: process.env.DATABASE_PASSWORD ?? 'root',
      database: process.env.DATABASE_NAME ?? 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    IamModule,
    RolesModule,
    UsersModule,
    RouterModule.register([
      {
        path: 'roles',
        module: RolesModule,
      },
      {
        path: 'authentication',
        module: IamModule,
      },
    ]),
    RoomsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

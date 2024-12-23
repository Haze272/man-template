import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookStatus } from './entities/book-status.entity';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookStatus, Room, User])],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}

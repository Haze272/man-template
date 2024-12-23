import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './entities/room-type.entity';
import { Amenity } from './entities/amenity.entity';
import { Room } from './entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomType, Amenity])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}

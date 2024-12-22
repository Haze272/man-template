import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomType } from "./entities/room-type.entity";
import { Amenity } from "./entities/amenity.entity";
import { Room } from "./entities/room.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomType, Amenity])],
})
export class RoomsModule {}

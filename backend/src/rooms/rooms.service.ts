import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RoomType } from './entities/room-type.entity';
import { Amenity } from './entities/amenity.entity';
import { CreateRoomDto } from './dto/create-room-dto';
import { UpdateRoomDto } from './dto/update-room-dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const room: CreateRoomDto & {
        roomType?: RoomType;
        amenities?: Amenity[];
      } = createRoomDto;
      room.roomType = await this.roomTypeRepository.findOneBy({
        id: createRoomDto.roomTypeId,
      });
      room.amenities = await Promise.all(
        createRoomDto.amenityIds.map(async (amenityId): Promise<Amenity> => {
          const amenity = await this.amenityRepository.findOneOrFail({
            where: { id: amenityId },
          });

          if (!amenity) {
            throw new BadGatewayException(
              `Удобство id=${amenityId} не найдено`,
            );
          }

          return amenity;
        }),
      );

      return await this.roomRepository.save(room);
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.roomRepository.find({
      relations: {
        roomType: true,
        amenities: true,
      },
    });
  }

  findOne(id: number) {
    return this.roomRepository.findOne({
      where: { id: id },
      relations: {
        roomType: true,
        amenities: true,
      },
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      const room: Room = await this.roomRepository.findOneOrFail({
        where: { id: id },
      });

      if (!room) {
        throw new BadGatewayException(`Номер id=${id} не найден`);
      }

      const roomToUpdate = { ...room, ...updateRoomDto };

      return await this.roomRepository.save(roomToUpdate);
    } catch (err) {
      throw err;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}

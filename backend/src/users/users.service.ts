import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { ActiveUserData } from '../iam/models/active-user-data.model';
import { HashingService } from "../iam/hashing/hashing.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user: CreateUserDto & { roles?: Role[] } = createUserDto;
      user.password = await this.hashingService.hash(createUserDto.password);
      user.roles = [await this.rolesRepository.findOneBy({ name: 'user' })];
      return await this.usersRepository.save(user);
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.usersRepository.find({
      relations: {
        status: true,
        roles: true,
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.usersRepository
        .findOneOrFail({
          where: { id: id },
          relations: {
            status: true,
            roles: true,
          },
        })
        .catch((err) => {
          throw new BadGatewayException(`Пользователь id=${id} не найден`);
        });
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user: User = await this.usersRepository.findOneOrFail({
        where: { id: id },
      });

      if (!user) {
        throw new BadGatewayException(`Пользователь id=${id} не найден`);
      }

      const userToUpdate = { ...user, ...updateUserDto };

      return await this.usersRepository.save(userToUpdate);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number, activeUser: ActiveUserData) {
    try {
      const user: User = await this.usersRepository.findOneOrFail({
        where: { id: id },
        relations: {
          status: true,
          roles: true,
        },
      });

      if (!user) {
        throw new BadGatewayException(`Пользователь id=${id} не найден`);
      }

      if (user.roles) {
        const deletingUserMaxRole = user.roles.reduce((acc, curr) => {
          return acc < curr.level ? curr.level : acc;
        }, 0);
        const activeUserMaxRole = activeUser.roles.reduce((acc, curr) => {
          return acc < curr.level ? curr.level : acc;
        }, 0);
        console.log(
          '- - - - comparing max roles',
          deletingUserMaxRole,
          activeUserMaxRole,
        );
        if (deletingUserMaxRole >= activeUserMaxRole) {
          throw new BadGatewayException(
            `Пользователь id=${id} имеет роль уровня выше или наравне`,
          );
        }
      }

      await this.usersRepository.remove(user);
    } catch (err) {
      throw err;
    }
  }

  async updateRoles(id: number, updateUserRolesDto: UpdateUserRolesDto) {
    try {
      const roles: Role[] = await Promise.all(
        updateUserRolesDto.rolesId.map(async (roleId): Promise<Role> => {
          const role = await this.rolesRepository.findOneOrFail({
            where: { id: roleId },
          });

          if (!role) {
            throw new BadGatewayException(`Роль id=${roleId} не найдена`);
          }

          return role;
        }),
      );

      roles.map((role) => {
        console.log(role.name);
      });

      const userToUpdate = await this.usersRepository.findOne({
        where: { id: id },
        relations: { roles: true },
      });

      userToUpdate.roles = roles;

      await this.usersRepository.save(userToUpdate);
    } catch (err) {
      throw err;
    }
  }
}

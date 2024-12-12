import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  findAll() {
    return this.rolesRepository.find();
  }

  findAllByName(roleNames: string[]) {
    return this.rolesRepository.find({
      where: [{ name: In(roleNames) }],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }
}

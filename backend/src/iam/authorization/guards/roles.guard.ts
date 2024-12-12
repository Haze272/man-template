import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../roles.decorator';
import { Role } from '../../../roles/entities/role.entity';
import { RolesService } from '../../../roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles: string[] = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!contextRoles) return true;

    const requiredRoles: Role[] =
      await this.rolesService.findAllByName(contextRoles);

    const user = await this.usersRepository.findOne({
      where: { id: context.switchToHttp().getRequest().user.sub },
      relations: { roles: true },
    });

    return requiredRoles.some((requiredRole) => {
      return user.roles.some((role) => {
        return role.id === requiredRole.id;
      });
    });
  }
}

import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { Repository } from 'typeorm';
import { TableType } from './entities/table-type.entity';
import { CreateTableDto } from './dto/create-table-dto';
import { UpdateTableDto } from './dto/update-table-dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(TableType)
    private readonly tableTypeRepository: Repository<TableType>,
  ) {}

  async create(createTableDto: CreateTableDto) {
    try {
      const table: CreateTableDto & {
        tableType?: TableType;
      } = createTableDto;
      table.tableType = await this.tableTypeRepository.findOneBy({
        id: createTableDto.tableTypeId,
      });

      return await this.tableRepository.save(table);
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.tableRepository.find({
      relations: {
        tableType: true,
      },
    });
  }

  findAllTableTypes() {
    return this.tableTypeRepository.find();
  }

  findOne(id: number) {
    try {
      return this.tableRepository
        .findOne({
          where: { id: id },
          relations: {
            tableType: true,
          },
        })
        .catch((err) => {
          throw new BadGatewayException(`Стол id=${id} не найден`);
        });
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    try {
      const table = await this.tableRepository.findOneOrFail({
        where: { id: id },
      });

      if (!table) {
        throw new BadGatewayException(`Стол id=${id} не найден`);
      }

      if (updateTableDto.tableTypeId) {
        table.tableType = await this.tableTypeRepository.findOneBy({
          id: updateTableDto.tableTypeId,
        });
      }

      const tableToUpdate = { ...table, ...updateTableDto };

      return await this.tableRepository.save(tableToUpdate);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const table: Table = await this.tableRepository.findOneOrFail({
        where: { id: id },
      });

      if (!table) {
        throw new BadGatewayException(`Стол id=${id} не найдена`);
      }

      await this.tableRepository.remove(table);
    } catch (err) {
      throw err;
    }
  }
}

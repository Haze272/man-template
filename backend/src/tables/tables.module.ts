import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableType } from './entities/table-type.entity';
import { Table } from './entities/table.entity';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

@Module({
  imports: [TypeOrmModule.forFeature([Table, TableType])],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}

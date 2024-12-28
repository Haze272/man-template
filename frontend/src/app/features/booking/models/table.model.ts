import {TableType} from './table-type.model';

export type Table = {
  id: number;
  name: string;
  number: number;
  capacity: number;
  description: string;
  bookPrice: number;
  imageUrl: string;
  extra?: string;
  tableType: TableType;
}

import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BookStatus } from './entities/book-status.entity';
import { Table } from '../tables/entities/table.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookDto } from './dto/create-book-dto';
import { UpdateBookDto } from './dto/update-book-dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookStatus)
    private readonly bookStatusRepository: Repository<BookStatus>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBookDto: CreateBookDto, userId: number) {
    try {
      const book: CreateBookDto & {
        bookStatus?: BookStatus;
        user?: User;
        table?: Table;
        date?: Date;
      } = createBookDto;
      console.log(book);
      book.bookStatus = await this.bookStatusRepository
        .findOneBy({
          id: 1,
        })
        .catch(() => {
          throw new BadGatewayException(`Статус бронирование id=1 не найден`);
        });

      book.user = await this.userRepository
        .findOneBy({
          id: userId,
        })
        .catch(() => {
          throw new BadGatewayException(`Пользователь id=${userId} не найден`);
        });

      book.table = await this.tableRepository
        .findOneBy({
          id: createBookDto.tableId,
        })
        .catch(() => {
          throw new BadGatewayException(
            `Номер id=${createBookDto.tableId} не найден`,
          );
        });

      book.bookDate = new Date(book.bookDate);
      book.date = new Date();

      return await this.bookRepository.save(book);
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return this.bookRepository.find({
      relations: {
        bookStatus: true,
        user: true,
        table: true,
      },
    });
  }

  findAllBookStatuses() {
    return this.bookStatusRepository.find();
  }

  findAllByUserId(userId: number) {
    return this.bookRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        bookStatus: true,
        user: true,
        table: true,
      },
    });
  }

  findOne(id: number) {
    try {
      return this.bookRepository
        .findOneOrFail({
          where: { id: id },
          relations: {
            bookStatus: true,
            user: true,
            table: true,
          },
        })
        .catch(() => {
          throw new BadGatewayException(`Бронирование id=${id} не найдено`);
        });
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const book = await this.bookRepository.findOneOrFail({
        where: { id: id },
      });

      if (!book) {
        throw new BadGatewayException(`Бронирование id=${id} не найдено`);
      }

      if (updateBookDto.statusId) {
        book.bookStatus = await this.bookStatusRepository
          .findOneBy({
            id: updateBookDto.statusId,
          })
          .catch(() => {
            throw new BadGatewayException(
              `Статус бронирование id=${updateBookDto.statusId} не найден`,
            );
          });
      }

      if (updateBookDto.bookDate) {
        book.bookDate = new Date(updateBookDto.bookDate);
      }

      const bookToUpdate = { ...book, ...updateBookDto };

      bookToUpdate.date = new Date();

      return await this.bookRepository.save(bookToUpdate);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const book: Book = await this.bookRepository
        .findOneOrFail({
          where: { id: id },
        })
        .catch((err) => {
          throw new BadGatewayException(`Бронирование id=${id} не найдено`);
        });

      await this.bookRepository.remove(book);
    } catch (err) {
      throw err;
    }
  }
}

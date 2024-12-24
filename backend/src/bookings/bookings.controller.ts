import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookDto } from './dto/create-book-dto';
import { UpdateBookDto } from './dto/update-book-dto';
import { ActiveUser } from "../iam/active-user.decorator";
import { ActiveUserData } from "../iam/models/active-user-data.model";

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookingsService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('my')
  findAllByUserId(@ActiveUser() user: ActiveUserData) {
    return this.bookingsService.findAllByUserId(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookingsService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}

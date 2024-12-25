import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {MessageService} from 'primeng/api';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {BookingStatus} from '../../../booking/models/booking-status.model';
import {Room} from '../../../booking/models/room.model';
import {User} from '../../../iam/models/user.model';
import {Booking} from '../../../booking/models/booking.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {Dialog} from 'primeng/dialog';
import {IftaLabel} from 'primeng/iftalabel';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea';
import {RouterLink} from '@angular/router';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-admin-book-list-page',
  imports: [
    AsyncPipe,
    Button,
    TableModule,
    Dialog,
    FormsModule,
    IftaLabel,
    InputNumber,
    ReactiveFormsModule,
    Select,
    Textarea,
    DatePipe,
    RouterLink,
    DatePicker
  ],
  templateUrl: './admin-book-list-page.component.html',
  styleUrl: './admin-book-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBookListPageComponent {
  private readonly messageService = inject(MessageService);
  private readonly adminService = inject(AdminService);

  private destroy$ = new Subject<void>();

  rooms: Room[] = [];
  bookStatuses: BookingStatus[] = [];
  users: User[] = [];

  loadList$ = new Subject<void>()
  bookings$ = new Subject<Booking[]>();

  editDialog: boolean = false;
  editForm = new FormGroup({
    id: new FormControl<number | null>(null),
    period: new FormControl<Date[] | string[] | null>(null),
    date: new FormControl<Date | string  | null>(null),
    persons: new FormControl<number | null>(null),
    comment: new FormControl<string | null>(null),
    statusId: new FormControl<number | null>(null),
    userId: new FormControl<number | null>(null),
    roomId: new FormControl<number | null>(null),
    total: new FormControl<number | null>(null),
  });

  ngOnInit() {
    this.loadList$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.adminService.getAllBookings();
        })
      )
      .subscribe(bookings => {
        this.bookings$.next(bookings);
      });

    this.adminService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
      });

    this.adminService.getAllRooms()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rooms) => {
        this.rooms = rooms;
      });

    this.adminService.getAllBookingStatuses()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bookStatuses) => {
        this.bookStatuses = bookStatuses;
      });

    this.loadList$.next();
  }

  refreshList() {
    this.loadList$.next();
  }

  openEditDialog(bookingId: number) {
    this.editDialog = true;
    this.adminService.getBookingById(bookingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: book => {
          this.editForm.setValue({
            id: book.id,
            period: [new Date(book.dateStart), new Date(book.dateEnd)],
            date: new Date(book.date),
            persons: book.persons,
            comment: book.comment,
            statusId: book.bookStatus.id,
            userId: book.user.id,
            roomId: book.room.id,
            total: book.room.pricePerNight * book.persons * this.calculateNights(book.dateStart as string, book.dateEnd as string)
          });
        }
      });
  }

  calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Проверка на корректность дат
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    // Разница в миллисекундах
    const diffInMs = end.getTime() - start.getTime();

    // Разница в днях (1 ночь = 1 день)
    const nights = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return nights;
  }

  cancelEditDialog() {
    this.editForm.reset();
    this.editDialog = false;
  }

  submitEdit() {
    this.adminService.updateBooking(
      this.editForm.controls['id'].value as number,
      {
        dateStartInt: this.editForm.controls['period'].value![0].toString(),
        dateEndInt: this.editForm.controls['period'].value![1].toString(),
        persons: this.editForm.controls.persons.value ?? 0,
        comment: this.editForm.controls['comment'].value?.toString(),
        statusId: this.editForm.controls.statusId.value ?? 0,
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Бронирование изменено!',
            life: 3000
          });
          this.loadList$.next();

          this.editDialog = false;
          this.editForm.reset();
        }),
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Произошла ошибка! Обратитесь в поддержку',
            life: 3000
          });

          this.editDialog = false;
          this.editForm.reset();
        }
      });
  }

  deleteBook(bookingId: number) {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

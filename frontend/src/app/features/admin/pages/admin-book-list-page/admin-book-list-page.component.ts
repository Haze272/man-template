import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {MessageService} from 'primeng/api';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {BookingStatus} from '../../../booking/models/booking-status.model';
import {Table} from '../../../booking/models/table.model';
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
    DatePicker,
  ],
  templateUrl: './admin-book-list-page.component.html',
  styleUrl: './admin-book-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBookListPageComponent implements OnInit, OnDestroy {
  private readonly messageService = inject(MessageService);
  private readonly adminService = inject(AdminService);

  private destroy$ = new Subject<void>();

  tables: Table[] = [];
  bookStatuses: BookingStatus[] = [];
  users: User[] = [];

  loadList$ = new Subject<void>()
  bookings$ = new Subject<Booking[]>();

  editDialog: boolean = false;
  editForm = new FormGroup({
    id: new FormControl<number | null>(null),
    bookDate: new FormControl<Date | string[] | null>(null),
    date: new FormControl<Date | string  | null>(null),
    persons: new FormControl<number | null>(null),
    comment: new FormControl<string | null>(null),
    statusId: new FormControl<number | null>(null),
    userId: new FormControl<number | null>({ value: 0, disabled: true }),
    tableId: new FormControl<number | null>({ value: 0, disabled: true }),
    total: new FormControl<number | null>({ value: 0, disabled: true }),
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

    this.adminService.getAllTables()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tables) => {
        this.tables = tables;
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
            bookDate: new Date(book.bookDate),
            date: new Date(book.date),
            persons: book.persons,
            comment: book.comment,
            statusId: book.bookStatus.id,
            userId: book.user.id,
            tableId: book.table.id,
            total: book.table.bookPrice
          });
        }
      });
  }

  cancelEditDialog() {
    this.editForm.reset();
    this.editDialog = false;
  }

  submitEdit() {
    this.adminService.updateBooking(
      this.editForm.controls['id'].value as number,
      {
        dateBookInt: this.editForm.controls['bookDate'].value!.toString(),
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
            detail: 'Бронирование не изменено',
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

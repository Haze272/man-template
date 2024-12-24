import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from '../../services/booking.service';
import {AsyncPipe, DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {Booking} from '../../models/booking.model';

@Component({
  selector: 'app-my-books-page',
  imports: [
    AsyncPipe,
    RouterLink,
    DatePipe,
    Button
  ],
  templateUrl: './my-books-page.component.html',
  styleUrl: './my-books-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyBooksPageComponent implements OnInit, OnDestroy {
  private readonly messageService = inject(MessageService);
  private readonly bookingService = inject(BookingService);

  private destroy$ = new Subject<void>();

  allMyBookings$ = new Subject<Booking[]>();
  loadMyBookings$ = new Subject<void>();

  ngOnInit() {
    this.loadMyBookings$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.bookingService.getAllUserBookings();
        })
      )
      .subscribe(bookings => {
        this.allMyBookings$.next(bookings);
      })

    this.loadMyBookings$.next();
  }

  cancelBooking(bookingId: number) {
    this.bookingService.cancelBooking(bookingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Бронь отменена!',
          });
          this.loadMyBookings$.next();
        }),
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Произошла ошибка! Обратитесь в поддержку',
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

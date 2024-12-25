import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from '../../services/booking.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {InputNumber} from 'primeng/inputnumber';
import {Textarea} from 'primeng/textarea';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Observable, of, Subject, switchMap, takeUntil} from 'rxjs';
import {RoomsService} from '../../services/rooms.service';
import {Room} from '../../models/room.model';
import {AsyncPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-book-page',
  imports: [
    ReactiveFormsModule,
    DatePicker,
    InputNumber,
    Textarea,
    IftaLabel,
    InputText,
    AsyncPipe,
    RouterLink,
    Button
  ],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly bookingService = inject(BookingService);
  private readonly roomsService = inject(RoomsService);

  private destroy$ = new Subject<void>()

  room$ = new Observable<Room>();

  bookForm = new FormGroup({
    period: new FormControl(''),
    persons: new FormControl<number>(1),
    comment: new FormControl(''),
  });

  ngOnInit() {
    this.room$ = this.activatedRoute.paramMap
      .pipe(switchMap(params => {
        return this.roomsService.getRoomById(Number(params.get('roomId')));
      }));
  }

  submit(roomId: number) {
    this.bookingService.book({
      ...this.bookForm.value,
      roomId: roomId
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Бронь создана!',
          });
          this.router.navigateByUrl('/book/list');
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

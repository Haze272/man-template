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
import {TablesService} from '../../services/tables.service';
import {Table} from '../../models/table.model';
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
  private readonly tablesService = inject(TablesService);

  private destroy$ = new Subject<void>()

  table$ = new Observable<Table>();

  bookForm = new FormGroup({
    bookDate: new FormControl(''),
    persons: new FormControl<number>(1),
    comment: new FormControl(''),
  });

  ngOnInit() {
    this.table$ = this.activatedRoute.paramMap
      .pipe(switchMap(params => {
        return this.tablesService.getTableById(Number(params.get('tableId')));
      }));
  }

  submit(tableId: number) {
    console.log(tableId)
    this.bookingService.book({
      ...this.bookForm.value,
      tableId: tableId
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
            detail: 'Бронирование не удалось',
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {MessageService} from 'primeng/api';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {Table} from '../../../booking/models/table.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TableType} from '../../../booking/models/table-type.model';
import {AsyncPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {Dialog} from 'primeng/dialog';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'app-admin-table-list-page',
  imports: [
    AsyncPipe,
    Button,
    TableModule,
    Dialog,
    FormsModule,
    IftaLabel,
    InputText,
    ReactiveFormsModule,
    Select,
    Textarea,
    InputNumber
  ],
  templateUrl: './admin-table-list-page.component.html',
  styleUrl: './admin-table-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminTableListPageComponent implements OnInit, OnDestroy {
  private readonly messageService = inject(MessageService);
  private readonly adminService = inject(AdminService);

  private destroy$ = new Subject<void>();

  tableTypes: TableType[] = [];

  loadList$ = new Subject<void>();
  tables$ = new Subject<Table[]>();

  editDialog: boolean = false;
  editForm = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string | null>(null, {validators: [Validators.required]}),
    number: new FormControl<number | null>(null),
    capacity: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    bookPrice: new FormControl<number | null>(0),
    imageUrl: new FormControl<string | null>(null),
    extra: new FormControl<string | null>(null),
    tableTypeId: new FormControl<number | null>(null),
  });

  ngOnInit() {
    this.loadList$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.adminService.getAllTables();
        })
      )
      .subscribe(tables => {
        this.tables$.next(tables);
      });

    this.adminService.getAllTableTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tableTypes) => {
        this.tableTypes = tableTypes;
      });

    this.loadList$.next();
  }

  refreshList() {
    this.loadList$.next();
  }

  openEditDialog(tableId: number) {
    this.editDialog = true;
    this.adminService.getTableById(tableId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: table => {
          this.editForm.setValue({
            id: table.id,
            name: table.name,
            number: table.number,
            capacity: table.capacity,
            description: table.description,
            bookPrice: table.bookPrice,
            imageUrl: table.imageUrl,
            extra: table.extra ?? '',
            tableTypeId: table.tableType.id,
          });
        }
      });
  }

  cancelEditDialog() {
    this.editForm.reset();
    this.editDialog = false;
  }

  submitEdit() {
    this.adminService.updateTable(
      this.editForm.controls['id'].value as number,
      {
        name: this.editForm.controls['name'].value?.toString(),
        number: this.editForm.controls.number.value ?? 0,
        capacity: this.editForm.controls.capacity.value ?? 1,
        description: this.editForm.controls['description'].value?.toString(),
        bookPrice: this.editForm.controls.bookPrice.value ?? 0,
        imageUrl: this.editForm.controls['imageUrl'].value?.toString(),
        extra: this.editForm.controls['extra'].value?.toString(),
        tableTypeId: this.editForm.controls.tableTypeId.value!,
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Информация о столе изменена!',
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
            detail: 'Стол не изменен',
            life: 3000
          });

          this.editDialog = false;
          this.editForm.reset();
        }
      });
  }

  deleteTable(tableId: number) {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

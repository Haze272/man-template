import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {MessageService} from 'primeng/api';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {Room} from '../../../booking/models/room.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Amenity} from '../../../booking/models/amenity.model';
import {RoomType} from '../../../booking/models/room-type.model';
import {AsyncPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {Dialog} from 'primeng/dialog';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'app-admin-room-list-page',
  imports: [
    AsyncPipe,
    Button,
    TableModule,
    Dialog,
    FormsModule,
    IftaLabel,
    InputText,
    MultiSelect,
    ReactiveFormsModule,
    Select,
    Textarea,
    InputNumber
  ],
  templateUrl: './admin-room-list-page.component.html',
  styleUrl: './admin-room-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRoomListPageComponent implements OnInit, OnDestroy {
  private readonly messageService = inject(MessageService);
  private readonly adminService = inject(AdminService);

  private destroy$ = new Subject<void>();

  amenities: Amenity[] = [];
  roomTypes: RoomType[] = [];

  loadList$ = new Subject<void>();
  rooms$ = new Subject<Room[]>();

  editDialog: boolean = false;
  editForm = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string | null>(null, {validators: [Validators.required]}),
    number: new FormControl<number | null>(null),
    bedCapacity: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    pricePerNight: new FormControl<number | null>(0),
    imageUrl: new FormControl<string | null>(null),
    extra: new FormControl<string | null>(null),
    roomTypeId: new FormControl<number | null>(null),
    amenityIds: new FormControl<number[] | null>(null),
  });

  ngOnInit() {
    this.loadList$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.adminService.getAllRooms();
        })
      )
      .subscribe(rooms => {
        this.rooms$.next(rooms);
      });

    this.adminService.getAllAmenities()
      .pipe(takeUntil(this.destroy$))
      .subscribe((amenities) => {
        this.amenities = amenities;
      });

    this.adminService.getAllRoomTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((roomTypes) => {
        this.roomTypes = roomTypes;
      });

    this.loadList$.next();
  }

  refreshList() {
    this.loadList$.next();
  }

  openEditDialog(roomId: number) {
    this.editDialog = true;
    this.adminService.getRoomById(roomId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: room => {
          this.editForm.setValue({
            id: room.id,
            name: room.name,
            number: room.number,
            bedCapacity: room.bedCapacity,
            description: room.description,
            pricePerNight: room.pricePerNight,
            imageUrl: room.imageUrl,
            extra: room.extra ?? '',
            roomTypeId: room.roomType.id,
            amenityIds: room.amenities.map(amenity => amenity.id),
          });
        }
      });
  }

  cancelEditDialog() {
    this.editForm.reset();
    this.editDialog = false;
  }

  submitEdit() {
    this.adminService.updateRoom(
      this.editForm.controls['id'].value as number,
      {
        name: this.editForm.controls['name'].value?.toString(),
        number: this.editForm.controls.number.value ?? 0,
        bedCapacity: this.editForm.controls.bedCapacity.value ?? 1,
        description: this.editForm.controls['description'].value?.toString(),
        pricePerNight: this.editForm.controls.pricePerNight.value ?? 0,
        imageUrl: this.editForm.controls['imageUrl'].value?.toString(),
        extra: this.editForm.controls['extra'].value?.toString(),
        roomTypeId: this.editForm.controls.roomTypeId.value!,
        amenityIds: this.editForm.controls.amenityIds.value ?? undefined,
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Комната изменена!',
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

  deleteRoom(roomId: number) {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

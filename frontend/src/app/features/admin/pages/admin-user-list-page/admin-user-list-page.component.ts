import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {AdminService} from '../../services/admin.service';
import {MessageService} from 'primeng/api';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {User} from '../../../iam/models/user.model';
import {AsyncPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IftaLabel} from 'primeng/iftalabel';
import {MultiSelect} from 'primeng/multiselect';
import {InputText} from 'primeng/inputtext';
import {Role} from '../../../iam/models/role.model';

@Component({
  selector: 'app-admin-user-list-page',
  imports: [
    TableModule,
    AsyncPipe,
    Button,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    IftaLabel,
    MultiSelect,
    InputText
  ],
  templateUrl: './admin-user-list-page.component.html',
  styleUrl: './admin-user-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUserListPageComponent implements OnInit, OnDestroy {
  private readonly messageService = inject(MessageService);
  private readonly adminService = inject(AdminService);

  private destroy$ = new Subject<void>();

  roles: Role[] = [];

  loadList$ = new Subject<void>();
  users$ = new Subject<User[]>();

  editDialog: boolean = false;
  editForm = new FormGroup({
    id: new FormControl<number | null>(null),
    email: new FormControl<string | null>(null, {validators: [Validators.required, Validators.email]}),
    username: new FormControl<string | null>(null, {validators: [Validators.required]}),
    name: new FormControl<string | null>(null),
    surname: new FormControl<string | null>(null),
    patronymic: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    roleIds: new FormControl<number[] | null>(null),
  });

  ngOnInit() {
    this.loadList$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.adminService.getAllUsers();
        })
      )
      .subscribe(users => {
        this.users$.next(users);
      });

    this.adminService.getAllRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe((roles) => {
        this.roles = roles;
      });

    this.loadList$.next();
  }

  refreshList() {
    this.loadList$.next();
  }

  banUser(userId: number) {
    this.adminService.updateUser(userId, { status: 2 } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Пользователь забанен!',
            life: 3000
          });
          this.loadList$.next();
        }),
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Пользователь не изменен',
            life: 3000
          });
        }
      });
  }

  unbanUser(userId: number) {
    this.adminService.updateUser(userId, { status: 1 } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Пользователь разбанен!',
            life: 3000
          });
          this.loadList$.next();
        }),
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Пользователь не изменен',
            life: 3000
          });
        }
      });
  }

  openEditDialog(userId: number) {
    this.editDialog = true;
    this.adminService.getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: user => {
          this.editForm.setValue({
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            surname: user.surname,
            patronymic: user.patronymic,
            phone: user.phone,
            roleIds: user.roles.map(role => role.id),
          });
        }
      });
  }

  cancelEditDialog() {
    this.editForm.reset();
    this.editDialog = false;
  }

  submitEdit() {
    this.adminService.updateUser(
      this.editForm.controls['id'].value as number,
      {
        email: this.editForm.controls['email'].value?.toString(),
        username: this.editForm.controls['username'].value?.toString(),
        name: this.editForm.controls['name'].value?.toString(),
        surname: this.editForm.controls['surname'].value?.toString(),
        patronymic: this.editForm.controls['patronymic'].value?.toString(),
        phone: this.editForm.controls['phone'].value?.toString(),
        rolesIds: this.editForm.controls.roleIds.value ?? undefined,
      }
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Пользователь изменен!',
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
            detail: 'Пользователь не изменен',
            life: 3000
          });

          this.editDialog = false;
          this.editForm.reset();
        }
      });
  }



  deleteUser(userId: number) {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

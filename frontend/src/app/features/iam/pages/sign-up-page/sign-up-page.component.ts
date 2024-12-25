import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, switchMap, takeUntil} from 'rxjs';
import {Button} from 'primeng/button';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Router, RouterLink} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    ReactiveFormsModule,
    Button,
    IftaLabel,
    InputText,
    Password,
    RouterLink
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);

  #destroy$ = new Subject<void>()

  signUpForm!: FormGroup;
  signUpProcess$ = new Subject<void>();

  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl<string | null>(null, Validators.required),
      email: new FormControl<string | null>(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl<string | null>(null, Validators.required),
      surname: new FormControl<string | null>(null, Validators.required),
      name: new FormControl<string | null>(null, Validators.required),
      patronymic: new FormControl<string | null>(null, Validators.required),
      phone: new FormControl<string | null>(null, Validators.required),
    });

    this.signUpProcess$
      .pipe(
        takeUntil(this.#destroy$),
        switchMap(() => {
          return this.authService.signUp(this.signUpForm.value)
        }),
      )
      .subscribe({
        next: (v => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Аккаунт успешно зарегистрирован! Войдите с введенными данными',
            life: 5000
          });
          this.router.navigateByUrl('/auth/log-in');
        }),
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Произошла ошибка! Обратитесь в поддержку',
            life: 3000
          });
        }
      });
  }

  signUp() {
    this.signUpProcess$.next();
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}

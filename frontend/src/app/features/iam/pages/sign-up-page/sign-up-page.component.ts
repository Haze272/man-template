import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, switchMap, takeUntil} from 'rxjs';

@Component({
  selector: 'app-sign-up-page',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);

  #destroy$ = new Subject<void>()

  signUpForm!: FormGroup;
  signUpProcess$ = new Subject<{ username: string, email: string, password: string }>();

  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl<string | null>(null, Validators.required),
      email: new FormControl<string | null>(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl<string | null>(null, Validators.required),
    });

    this.signUpProcess$
      .pipe(
        takeUntil(this.#destroy$),
        switchMap(({email, username, password}) => {
          return this.authService.signUp(username, email, password)
        }),
      )
      .subscribe({
        next: () => {
          console.log("Reg success")
        },
        error: (err) => {
          console.error("Auth error")
        }
      });
  }

  signUp() {
    this.signUpProcess$.next({
      username: this.signUpForm.controls['username'].value,
      email: this.signUpForm.controls['email'].value,
      password: this.signUpForm.controls['password'].value
    });
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}

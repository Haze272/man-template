import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {Button} from 'primeng/button';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';

@Component({
  selector: 'app-sign-in-page',
  imports: [
    ReactiveFormsModule,
    Button,
    IftaLabel,
    InputText,
    Password,
    RouterLink
  ],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  #destroy$ = new Subject<void>()

  logInForm!: FormGroup;
  loginProcess$ = new Subject<{ login: string, password: string }>();

  redirectToAfterLogin: string = '';

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.#destroy$))
      .subscribe(params => {
        this.redirectToAfterLogin = params['redirectTo'];
      });

    setTimeout(() => {
      this.authService.activeUser$
        .pipe(takeUntil(this.#destroy$))
        .subscribe(user => {
          if (user) {
            console.log('[no-login.guard.ts]: person already logged!')

            if (this.redirectToAfterLogin) {
              this.router.navigateByUrl(this.redirectToAfterLogin);
            } else {
              this.router.navigateByUrl(`/`);
            }
          }
        });
    }, 2000);

    this.logInForm = new FormGroup({
      email: new FormControl<string | null>(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl<string | null>(null, Validators.required),
    });

    this.loginProcess$
      .pipe(
        takeUntil(this.#destroy$),
        switchMap(({login, password}) => {
          return this.authService.signIn(login, password)
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl(this.redirectToAfterLogin);
          console.log("Auth success")
        },
        error: (err) => {
          console.error("Auth error")
        }
      });
  }

  logIn() {
    this.loginProcess$.next({
      login: this.logInForm.controls['email'].value,
      password: this.logInForm.controls['password'].value
    });
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}

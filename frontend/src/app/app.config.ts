import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {AuthService} from './features/iam/services/auth.service';
import {ConfigService} from './features/config/config.service';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      const configService = inject(ConfigService)

      configService.config = await configService.loadConfig();

      if (configService.config.auth.autologin) {
        authService.autoLogin().subscribe(() => {
          console.log('[app.config.ts]: auto login successfully');
        });
      }


      console.info('App initialized!');
      console.log('config:', configService.config);

      return true;
    }),
  ]
};

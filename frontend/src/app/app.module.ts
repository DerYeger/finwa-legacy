import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SetupPage } from './pages/setup/setup.page';
import { MaterialModule } from './material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './store/reducers';
import { DEFAULT_COLOR_SCHEME, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomePage } from './pages/home/home.page';
import { MainPage } from './pages/main/main.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendConfigComponent } from './components/backend-config/backend-config.component';
import { LoginComponent } from './components/login/login.component';
import { HttpProgressBarComponent } from './components/http-progress-bar/http-progress-bar.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserManagementPage } from './pages/user-management/user-management.page';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  declarations: [AppComponent, SetupPage, HomePage, MainPage, BackendConfigComponent, LoginComponent, HttpProgressBarComponent, UserManagementPage],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    LoggerModule.forRoot({
      level: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF,
      serverLoggingUrl: undefined,
      disableConsoleLogging: false,
      enableSourceMaps: !environment.production,
      timestampFormat: undefined,
      colorScheme: DEFAULT_COLOR_SCHEME,
      httpResponseType: 'json',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

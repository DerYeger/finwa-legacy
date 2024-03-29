import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DEFAULT_COLOR_SCHEME, LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { BackendConfigComponent } from 'src/app/components/backend-config/backend-config.component';
import { HttpProgressBarComponent } from 'src/app/components/http-progress-bar/http-progress-bar.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { UserTableComponent } from 'src/app/components/user-table/user-table.component';
import { UpdateAvailableDialog } from 'src/app/dialogs/update-available/update-available.dialog';
import { UserCreationDialog } from 'src/app/dialogs/user-creation/user-creation.dialog';
import { UserEditDialog } from 'src/app/dialogs/user-edit/user-edit.dialog';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { ErrorInterceptor } from 'src/app/interceptors/error.interceptor';
import { MaterialModule } from 'src/app/material/material.module';
import { HomePage } from 'src/app/pages/home/home.page';
import { MainPage } from 'src/app/pages/main/main.page';
import { SetupPage } from 'src/app/pages/setup/setup.page';
import { UserManagementPage } from 'src/app/pages/user-management/user-management.page';
import { metaReducers, reducers } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    BackendConfigComponent,
    HomePage,
    HttpProgressBarComponent,
    LoginComponent,
    MainPage,
    SetupPage,
    UpdateAvailableDialog,
    UserCreationDialog,
    UserEditDialog,
    UserFormComponent,
    UserManagementPage,
    UserTableComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
    MaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot(reducers, { metaReducers }),
    TranslateModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

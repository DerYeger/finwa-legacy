import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/guards/auth.guard';
import { HomePage } from 'src/app/pages/home/home.page';
import { MainPage } from 'src/app/pages/main/main.page';
import { SetupPage } from 'src/app/pages/setup/setup.page';
import { UserManagementPage } from 'src/app/pages/user-management/user-management.page';

export const routes: Routes = [
  { path: 'setup', component: SetupPage, canActivate: [AuthGuard] },
  {
    path: '',
    component: MainPage,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomePage },
      { path: 'users', component: UserManagementPage },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

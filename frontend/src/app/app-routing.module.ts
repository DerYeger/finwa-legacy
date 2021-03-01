import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupPage } from './pages/setup/setup.page';
import { AuthGuard } from './guards/auth.guard';
import { HomePage } from './pages/home/home.page';
import { MainPage } from './pages/main/main.page';
import { UserManagementPage } from './pages/user-management/user-management.page';

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

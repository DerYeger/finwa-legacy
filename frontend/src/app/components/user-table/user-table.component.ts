import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { User } from 'src/app/model/domain/user';
import { BackendService } from 'src/app/services/backend.service';
import { State } from 'src/app/store/state';

@Component({
  selector: 'finwa-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false })
  private sort!: MatSort;

  public readonly dataSource = new MatTableDataSource<User>([]);

  public readonly columns: string[] = ['name', 'actions'];

  public readonly usersSubscription = this.store
    .select('userCache')
    .pipe(map((usersCache) => usersCache.users))
    .subscribe((users) => (this.dataSource.data = users));

  public constructor(private readonly store: Store<State>, private readonly backendService: BackendService) {}

  public ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  public deleteUserById(id: string): void {
    this.backendService.deleteUserById(id).subscribe();
  }
}

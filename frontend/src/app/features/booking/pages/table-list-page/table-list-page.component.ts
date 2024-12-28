import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TablesService} from '../../services/tables.service';
import {AsyncPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-table-list-page',
  imports: [
    AsyncPipe,
    Button,
  ],
  templateUrl: './table-list-page.component.html',
  styleUrl: './table-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableListPageComponent {
  private readonly router = inject(Router);
  private readonly roomsService = inject(TablesService);

  allTables$ = this.roomsService.getAllTables();

  bookTable(event: Event, tableId: number) {
    event.stopPropagation();

    this.router.navigateByUrl(`/book/${tableId}`)
  }
}

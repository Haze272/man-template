import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Table} from '../models/table.model';
import {ConfigService} from '../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getAllTables() {
    return this.http.get<Table[]>(
      this.configService.config.bookingUrl + '/tables',
      { withCredentials: true }
    )
  }

  getTableById(tableId: number) {
    return this.http.get<Table>(
      this.configService.config.bookingUrl + `/tables/${tableId}`,
      { withCredentials: true }
    );
  }
}

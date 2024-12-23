import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RoomsService} from '../../services/rooms.service';
import {AsyncPipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-room-list-page',
  imports: [
    AsyncPipe,
    NgClass,
    Button
  ],
  templateUrl: './room-list-page.component.html',
  styleUrl: './room-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListPageComponent {
  private readonly roomsService = inject(RoomsService);

  allRooms$ = this.roomsService.getAllRooms();
}

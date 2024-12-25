import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RoomsService} from '../../services/rooms.service';
import {AsyncPipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-room-list-page',
  imports: [
    AsyncPipe,
    NgClass,
    Button,
    RouterLink
  ],
  templateUrl: './room-list-page.component.html',
  styleUrl: './room-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListPageComponent {
  private readonly router = inject(Router);
  private readonly roomsService = inject(RoomsService);

  allRooms$ = this.roomsService.getAllRooms();

  bookRoom(event: Event, roomId: number) {
    event.stopPropagation();

    this.router.navigateByUrl(`/book/${roomId}`)
  }
}

import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {Card} from 'primeng/card';
import {Booking} from '../../../booking/models/booking.model';
import {User} from '../../../iam/models/user.model';
import {Room} from '../../../booking/models/room.model';
import {map, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-admin-home-page',
  imports: [
    Card,
    AsyncPipe
  ],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomePageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  private destroy$ = new Observable<void>();

  books$ = new Observable<Booking[]>();

  users$ = new Observable<User[]>();

  rooms$ = new Observable<Room[]>();
  roomsStandart$ = new Observable<Room[]>();
  roomsComfort$ = new Observable<Room[]>();
  roomsLux$ = new Observable<Room[]>();

  ngOnInit() {
    this.books$ = this.adminService.getAllBookings();

    this.users$ = this.adminService.getAllUsers();

    this.rooms$ = this.adminService.getAllRooms();

    this.roomsStandart$ = this.rooms$.pipe(map(rooms => {
      return rooms.filter(room => room.roomType.id === 1);
    }));

    this.roomsComfort$ = this.rooms$.pipe(map(rooms => {
      return rooms.filter(room => room.roomType.id === 2);
    }));

    this.roomsLux$ = this.rooms$.pipe(map(rooms => {
      return rooms.filter(room => room.roomType.id === 3);
    }));
  }
}

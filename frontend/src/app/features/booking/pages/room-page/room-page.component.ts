import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {RoomsService} from '../../services/rooms.service';
import {Room} from '../../models/room.model';
import {Observable, Subject, switchMap} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-room-page',
  imports: [
    AsyncPipe,
    Button,
    NgClass,
    RouterLink
  ],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPageComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly roomsService = inject(RoomsService);

  private destroy$ = new Subject<void>();

  room$ = new Observable<Room>();

  ngOnInit() {
    this.room$ = this.activatedRoute.paramMap
      .pipe(switchMap(params => {
            return this.roomsService.getRoomById(Number(params.get('id')));
      }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

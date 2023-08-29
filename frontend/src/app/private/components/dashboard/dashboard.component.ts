import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';

import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { RoomPaginateInterface } from 'src/app/model/room.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  rooms$: Observable<RoomPaginateInterface> = this.chatService.getMyRooms();
  selectedRoom = null;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  ngAfterViewInit(): void {
    this.chatService.emitPaginateRooms(10, 0);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }
}

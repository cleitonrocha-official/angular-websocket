//app.component.ts
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  messages = 'iniando';
  title = "WebSocket - Demo";

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.webSocketService.getMessageObservable().subscribe(data => {
      console.log(data);
      this.messages = data;
    });
  }

}

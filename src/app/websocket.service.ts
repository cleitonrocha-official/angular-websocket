// websocket.service.ts
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  private messageSubject = new BehaviorSubject<string>('');
  private serverUrl = 'http://localhost:8080/ws';

 

  constructor() {
    this.initializeWebSocketConnection();
  }

  public connect(): void {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws );
    
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/greetings', (message: any) => {
        if (message.body) {
          const parsedMessage = JSON.parse(message.body);
          this.messageSubject.next(parsedMessage.message);
        }
      });
    }, this.onError);

    ws.onclose = this.onClose; // Adicionado handler para evento de fechamento
  }

  getMessageObservable(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  private onError = (error: any) => {
    console.error('Erro na conexão WebSocket:', error);
    this.reconnect(); // Tentativa de reconectar
  };

  private onClose = () => {
    console.log('Conexão WebSocket fechada. Tentando reconectar...');
    this.reconnect(); // Tentativa de reconectar
  };

  private reconnect(): void {
    setTimeout(() => {
      console.log('Tentando reconectar ao WebSocket...');
      this.connect();
    }, 5000); // Aguarda 5 segundos antes de tentar reconectar
  }



}

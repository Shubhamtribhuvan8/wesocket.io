// src/websockets/project-a.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { Server } from 'http';

@WebSocketGateway({ namespace: 'project-a' })
export class ProjectAGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: WebSocket.Server;


    handleConnection(client: WebSocket) {
        client.on('message', (data) => {
            console.log(`hey !Received message from Project C : ${data}`);
        });
    }

    handleDisconnect(client: WebSocket) {
        console.log('A client disconnected from Project B server');
    }

    initWebSocketServer(httpServer: Server) {
        this.server = new WebSocket.Server({ noServer: true });

        this.server.on('connection', (ws) => {
            // Handle WebSocket connection logic
            this.handleConnection(ws);
        });

        httpServer.on('upgrade', (request, socket, head) => {
            this.server.handleUpgrade(request, socket, head, (ws) => {
                this.server.emit('connection', ws, request);
            });
        });


    }

    // Project A

    @SubscribeMessage('message')
    handleMessageFromProjectA(@MessageBody() data: string): WsResponse<string> {
        console.log(`Received message from Project A: ${data}`);
        return { event: 'message', data };
    }
}
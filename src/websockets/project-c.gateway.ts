// src/websockets/project-c.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { Server } from 'http';

@WebSocketGateway({ namespace: 'project-c' })
export class ProjectCGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: WebSocket.Server;

    // handleConnection(client: WebSocket, ...args: any[]) {
    //     console.log(`Client connected:`, ...args);

    // }

    handleDisconnect(client: WebSocket) {
        // console.log(`Client disconnected: ${client.id}`);
    }


    // Project C

    initWebSocketServer(httpServer: Server) {
        this.server = new WebSocket.Server({ noServer: true });

        this.server.on('connection', (ws) => {
            ws.on('error', (error) => {
                console.error('Error occurred1:', error);
            });
            // Handle WebSocket connection logic
            this.handleConnection(ws);
        });


        httpServer.on('upgrade', (request, socket, head) => {
            this.server.handleUpgrade(request, socket, head, (ws) => {
                this.server.emit('connection', ws, request);
            });
        });
    }

    async sendMessageToProjectB(message: string) {
        // Assuming project-b is running on port 3002
        const projectBClient = new WebSocket('ws://localhost:3002/project-b');

        projectBClient.on('open', async () => {
            console.log('Connected to Project B');
            await projectBClient.send(message);
            console.log(`Sent message to Project B: ${message}`);
        });

        projectBClient.on('message', async (data) => {
            console.log(`Received message from Project B: ${data}`);
            await projectBClient.close();
        });

        projectBClient.on('error', (error) => {
            console.log('Error occurred2:', error);
        });
    }
    async handleConnection(client: WebSocket, ...args: any[]) {
        console.log(`Client connected:`);
        await this.sendMessageToProjectB("hello kapil &shubham!");
    }
}

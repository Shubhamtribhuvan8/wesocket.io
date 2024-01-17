// src/websockets/project-b-server.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { Server } from 'http';

@WebSocketGateway(3001, { namespace: 'project-a' })
export class ProjectBServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: WebSocket.Server;
    private projectBClientGateway: ProjectBClientGateway;

    handleConnection(client: WebSocket) {

        console.log('Connected B to C',);
    }

    handleDisconnect(client: WebSocket) {
        console.log('B client disconnected from Project C server');
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

    // @SubscribeMessage('message')
    // handleMessageFromProjectA(@MessageBody() data: string): WsResponse<string> {
    //     console.log(`Received message from Project A: ${data}`);

    //     // Forward the message to Project C
    //     this.projectBClientGateway.sendMessageToProjectC(data);
    //     console.log(`Forwarded message to Project C: ${data}`);

    //     return { event: 'message', data: 'Message forwarded to Project C' };
    // }
}

@WebSocketGateway()
export class ProjectBClientGateway {
    private projectCClient: WebSocket;
    private projectAClient: WebSocket;
    constructor() {
        this.initWebSocketClient();
    }

    initWebSocketClient() {
        // Establish a WebSocket client connection to Project C


        this.projectAClient = new WebSocket('ws://localhost:3001/project-a');

        this.projectAClient.on('open', () => {
            console.log('B:1 Connected to Project A');
        });

        this.projectAClient.on('message', async (data) => {
            console.log(`Received message from Project A: ${data}`);
        });

        this.projectAClient.on('error', (error) => {
            console.log('Error occurred:', error);
        });


        this.projectCClient = new WebSocket('ws://localhost:3003/project-c');

        this.projectCClient.on('open', () => {
            console.log('B:2 Connected to Project C',);
        });

        this.projectCClient.on('message', (data) => {
            console.log(`Received message from Project C: ${data}`);
        });

        this.projectCClient.on('error', (error) => {
            console.log('Error occurred3:', error);
        });
    }


    async sendMessageToProjectA(message: string) {

        if (this.projectAClient.readyState === WebSocket.OPEN) {
            await this.projectAClient.send(message);
            console.log(`Sent message to Project A: ${message}`);
        } else {
            console.log('Cannot send message to Project A, connection is not open');
        }
    }

    async sendMessageToProjectC(message: string) {
        if (this.projectCClient.readyState === WebSocket.OPEN) {
            await this.projectCClient.send(message);
            console.log(`Sent message to Project C: ${message}`);
        } else {
            console.log('Cannot send message to Project C, connection is not open');
        }
    }
}
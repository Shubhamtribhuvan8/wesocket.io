import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProjectAGateway } from './websockets/project-a.gateway';
import { ProjectBClientGateway } from './websockets/project-b.gateway';
import { ProjectCGateway } from './websockets/project-c.gateway';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  await httpApp.listen(3000);

  const wsAppA = await NestFactory.create(AppModule);
  const projectAGateway = wsAppA.get(ProjectAGateway) as ProjectAGateway;
  const projectAServer = await wsAppA.listen(3001, () => {
    console.log('Project A WebSocket server is running on port 3001.');
  });
  projectAGateway.initWebSocketServer(projectAServer);

  const wsAppB = await NestFactory.create(AppModule);
  const projectBClientGateway = wsAppB.get(ProjectBClientGateway) as ProjectBClientGateway;
  const projectBServer = await wsAppB.listen(3002, () => {
    console.log('Project B WebSocket server is running on port 3002.');
  });
  projectBClientGateway.initWebSocketClient();

  const wsAppC = await NestFactory.create(AppModule);
  const projectCGateway = wsAppC.get(ProjectCGateway) as ProjectCGateway;
  const projectCServer = await wsAppC.listen(3003, () => {
    console.log('Project C WebSocket server is running on port 3003.');
  });
  projectCGateway.initWebSocketServer(projectCServer);
}

bootstrap();
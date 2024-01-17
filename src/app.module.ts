import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ProjectAGateway } from './websockets/project-a.gateway';
import { ProjectCGateway } from './websockets/project-c.gateway';
import { ProjectBClientGateway } from './websockets/project-b.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ProjectAGateway, ProjectCGateway, ProjectBClientGateway],
})
export class AppModule { }

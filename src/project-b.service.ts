// src/project-b.service.ts
import { Injectable } from '@nestjs/common';
import { ProjectAGateway } from './websockets/project-a.gateway';
import { ProjectCGateway } from './websockets/project-c.gateway';

@Injectable()
export class ProjectBService {
    constructor(
        private readonly projectAGateway: ProjectAGateway,
        private readonly projectCGateway: ProjectCGateway,
    ) { }

    // Use projectAGateway.server and projectCGateway.server to handle WebSocket connections.
}

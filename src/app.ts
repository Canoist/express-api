import express, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";

// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";
import { IExeptionFilter } from "./errors/exceiption.filter.interface";
import IConfigService from "./config/config.service.interface";
import { PrismaService } from "./database/prisma.service";
import UserController from "./users/user.controller";
import AuthMiddleware from "./common/auth.middleware";

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
        this.exeptionFilter = exeptionFilter;
    }

    useMiddleware(): void {
        this.app.use(express.json());
        const authMiddlware = new AuthMiddleware(this.configService.get("SECRET"));
        this.app.use(authMiddlware.execute.bind(authMiddlware));
    }

    useRoutes(): void {
        this.app.use("/users", this.userController.router);
    }

    useExceptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server started at port: ${this.port}`);
    }

    public close(): void {
        this.server.close();
    }
}

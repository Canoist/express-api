import express, { Express } from "express";
import { Server } from "http";
import { ExeptionFilter } from "./errors/exceiption.filter";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/user.controller";

export class App {
    app: Express;
    server: Server;
    port: number;
    logger: ILogger;
    userController: UserController;
    exeptionFilter: ExeptionFilter;

    constructor(
        logger: ILogger,
        userController: UserController,
        exeptionFilter: ExeptionFilter
    ) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
        this.exeptionFilter = exeptionFilter;
    }

    useRoutes() {
        this.app.use("/users", this.userController.router);
    }

    useExceptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server started at port: ${this.port}`);
    }
}

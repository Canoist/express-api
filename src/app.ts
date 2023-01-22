import express, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import { ExeptionFilter } from "./errors/exceiption.filter";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { UserController } from "./users/user.controller";

// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
    ) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
        this.exeptionFilter = exeptionFilter;
    }

    useMiddleware(): void {
        this.app.use(express.json());
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
        this.server = this.app.listen(this.port);
        this.logger.log(`Server started at port: ${this.port}`);
    }
}

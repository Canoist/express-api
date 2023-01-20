import { IControllerRoute } from "./routes.interface";
import { Response, Router } from "express";
import { ILogger } from "../logger/logger.interface";
import { injectable } from "inversify";

// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";

@injectable()
export abstract class BaseControler {
    private readonly _router: Router;
    private logger: ILogger;

    constructor(logger: ILogger) {
        this._router = Router();
        this.logger = logger;
    }
    get router() {
        return this._router;
    }

    public send<T>(res: Response, message: T, code: number) {
        res.type("application/json");
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T) {
        return this.send(res, message, 200);
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        }
    }
}

import { ExpressReturnType, IControllerRoute } from "./routes.interface";
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
    get router(): Router {
        return this._router;
    }

    public send<T>(res: Response, message: T, code: number): ExpressReturnType {
        res.type("application/json");
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T): ExpressReturnType {
        return this.send(res, message, 200);
    }

    public created(res: Response): ExpressReturnType {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IControllerRoute[]): void {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const middleware = route.middlewares?.map((m) => m.execute.bind(m));
            const handler = route.func.bind(this);
            const pipeline = middleware ? [...middleware, handler] : handler;
            this.router[route.method](route.path, pipeline);
        }
    }
}

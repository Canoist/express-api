import { IControllerRoute } from "./routes.interface";
import { Response, Router } from "express";
import { LoggerService } from "../logger/logger.service";

export abstract class BaseControler {
    private readonly _router: Router;

    constructor(private logger: LoggerService) {
        this._router = Router();
    }
    get router() {
        return this._router;
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    public send<T>(res: Response, message: T, code: number) {
        res.type("application/json");
        return res.sendStatus(code).json(message);
    }

    public ok<T>(res: Response, message: T) {
        return this.send(res, message, 200);
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        }
    }
}

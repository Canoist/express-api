import { BaseControler } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";
import { HTTPError } from "../errors/http-error.class";
import { IUserController } from "./user.interface";

class User {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
const users = [];

@injectable()
export class UserController extends BaseControler implements IUserController {
    path: string;
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
        this.bindRoutes([
            { path: "/register", method: "post", func: this.register },
            { path: "/login", method: "post", func: this.login },
        ]);
    }

    login(req: Request, res: Response, next: NextFunction): void {
        users.push(new User("new User" + Math.random()));
        next(new HTTPError(401, "Ошибка авторизации", "login"));
    }
    register(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, "register");
    }
}

import { BaseControler } from "../common/base.controller";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";
import { HTTPError } from "../errors/http-error.class";
import { IUserController } from "./user.interface";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { UserService } from "./users.service";
import ValidateMiddlware from "../common/validate.middleware";

@injectable()
export class UserController extends BaseControler implements IUserController {
    path: string;
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: UserService,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: "/register",
                method: "post",
                func: this.register,
                middlewares: [new ValidateMiddlware(UserRegisterDto)],
            },
            { path: "/login", method: "post", func: this.login },
        ]);
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
        console.log(req.body);
        next(new HTTPError(401, "Ошибка авторизации", "login"));
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.userService.createUser(body);
        if (!result) {
            return next(new HTTPError(422, "User is already exists", "register"));
        }
        this.ok(res, result);
    }
}

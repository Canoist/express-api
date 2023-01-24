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
import { sign } from "jsonwebtoken";
import ConfigService from "../config/config.service";

@injectable()
export class UserController extends BaseControler implements IUserController {
    path: string;
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.ConfigService) private configService: ConfigService,
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

    async login(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.userService.validateUser(body);

        if (!result) {
            return next(new HTTPError(401, "Auth error", "login"));
        }

        const jwt = await this.signJWT(body.email, this.configService.get("SECRET"));

        this.ok(res, { jwt });
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

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                { algorithm: "HS256" },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token as string);
                },
            );
        });
    }
}

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import IMiddleware from "./midlleware.interface";
import IToken from "./token.interface";

export default class AuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.headers.authorization) {
            verify(
                req.headers.authorization.split(" ")[1],
                this.secret,
                { complete: false },
                (err, decoded) => {
                    if (err) {
                        next();
                    } else if (decoded) {
                        const result = decoded as IToken;
                        req.userEmail = result.email;
                        next();
                    }
                },
            );
        } else {
            next();
        }
    }
}

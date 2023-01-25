import IMiddleware from "./midlleware.interface";
import { NextFunction, Request, Response } from "express";

export default class AuthGuard implements IMiddleware {
    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.userEmail) {
            return next();
        } else {
            res.status(401).send({ error: "Not authorized" });
        }
    }
}

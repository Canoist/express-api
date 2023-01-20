import { NextFunction, Request, Response } from "express";

export interface IUserController {
    path: string;

    login: (req: Request, res: Response, next: NextFunction) => void;
    register: (req: Request, res: Response, next: NextFunction) => void;
}

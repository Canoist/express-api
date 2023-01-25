import { NextFunction, Request, Response } from "express";

export default interface IUserController {
    path: string;

    login: (req: Request, res: Response, next: NextFunction) => void;
    register: (req: Request, res: Response, next: NextFunction) => void;
    info: (req: Request, res: Response, next: NextFunction) => void;
}

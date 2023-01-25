import { inject, injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import IUserService from "./users.service.interface";
// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";
import { TYPES } from "../types";
import IConfigService from "../config/config.service.interface";
import IUsersRepository from "./users.repository.interface";
import { UserModel } from "@prisma/client";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
    ) {}

    async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configService.get("SALT");

        if (isNaN(Number(salt))) {
            await newUser.setPassword(password, salt);
        } else {
            await newUser.setPassword(password, Number(salt));
        }

        const existedUser = await this.usersRepository.find(email);
        console.log(existedUser);

        if (existedUser) {
            return null;
        }

        return this.usersRepository.create(newUser);
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        const existedUser = await this.usersRepository.find(email);

        if (!existedUser) {
            return false;
        }
        const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
        return newUser.comparePassword(password);
    }

    async getUser(email: string): Promise<UserModel | null> {
        return await this.usersRepository.find(email);
    }
}

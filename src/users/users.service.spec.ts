import "reflect-metadata";
import { Container, id } from "inversify";
import IConfigService from "../config/config.service.interface";
import { TYPES } from "../types";
import IUsersRepository from "./users.repository.interface";
import { UserService } from "./users.service";
import IUserService from "./users.service.interface";
import { User } from "./user.entity";
import { UserModel } from "@prisma/client";

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
};

const UsersRepository: IUsersRepository = {
    create: jest.fn(),
    find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersservice: IUserService;

beforeAll(() => {
    container.bind<IUserService>(TYPES.UserService).to(UserService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepository);
    // Можно bind'ить к константам (mock data)

    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
    usersservice = container.get<IUserService>(TYPES.UserService);
    // Получили компоненты из контейнера
});

describe("User service", () => {
    it("createUser", async () => {
        configService.get = jest.fn().mockReturnValueOnce("1");
        // Имитируем получения данных из файла конфига

        usersRepository.create = jest.fn().mockImplementationOnce(
            (user: User): UserModel => ({
                email: user.email,
                password: user.password,
                name: user.name,
                id: 1,
            }),
        );
        // Имитируем создание пользователя в базе данных

        const createdUser = await usersservice.createUser({
            email: "a@a.ru",
            password: "somePass",
            name: "user",
        });

        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual("somePass");
        // Сам тест
    });
});

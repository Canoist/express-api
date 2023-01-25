import "reflect-metadata";
import { Container } from "inversify";
import IConfigService from "../config/config.service.interface";
import { TYPES } from "../types";
import IUsersRepository from "./users.repository.interface";
import { UserService } from "./users.service";
import IUserService from "./users.service.interface";

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
    it("createUser", async () => {});
});

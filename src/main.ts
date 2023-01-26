import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import ConfigService from "./config/config.service";
import IConfigService from "./config/config.service.interface";
import { PrismaService } from "./database/prisma.service";
import { ExeptionFilter } from "./errors/exceiption.filter";
import { IExeptionFilter } from "./errors/exceiption.filter.interface";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { TYPES } from "./types";
import IUserService from "./users/users.service.interface";
import UsersRepository from "./users/users.repository";
import IUsersRepository from "./users/users.repository.interface";
import { UserService } from "./users/users.service";
import IUserController from "./users/user.controller.interface";
import UserController from "./users/user.controller";

interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

    // bind<UserController>(TYPES.UserController).to(UserController);
    // Если не буем использовать больше никаких реализаций для данных методов, то можно в <> указывать не интерфейс, а саму реализацию
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
    bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    await app.init();
    return { app, appContainer };
}

export const boot = bootstrap();

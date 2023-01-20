import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { ExeptionFilter } from "./errors/exceiption.filter";
import { IExeptionFilter } from "./errors/exceiption.filter.interface";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { TYPES } from "./types";
import { UserController } from "./users/user.controller";
import { IUserController } from "./users/user.interface";

// async function bootstrap() {
// const logger = new LoggerService();
// const app = new App(
//     logger,
//     new UserController(logger),
//     new ExeptionFilter(logger)
// );
// await app.init();
// }

// bootstrap();

interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IUserController>(TYPES.UserController).to(UserController);
    // bind<UserController>(TYPES.UserController).to(UserController);
    // Если не буем использовать больше никаких реализаций для данных методов, то можно в <> указывать не интерфейс, а саму реализацию
    bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { app, appContainer };
}

export const { app, appContainer } = bootstrap();

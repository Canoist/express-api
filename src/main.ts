import { Container } from "inversify";
import { App } from "./app";
import { ExeptionFilter } from "./errors/exceiption.filter";
import { IExeptionFilter } from "./errors/exceiption.filter.interface";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { TYPES } from "./types";
import { UserController } from "./users/user.controller";

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

const appContainer = new Container();
appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);
// Если не буем использовать больше никаких реализаций для данных методов, то можно в <> указывать не интерфейс, а саму реализацию
appContainer.bind<App>(TYPES.Application).to(App);

const app = appContainer.get<App>(TYPES.Application);
app.init();

export { app, appContainer };

import { injectable } from "inversify";
import { Logger } from "tslog";
import { ILogger } from "./logger.interface";

// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";

@injectable()
export class LoggerService implements ILogger {
    public logger: Logger<unknown>;
    constructor() {
        this.logger = new Logger({
            prettyLogTemplate: "{{dateIsoStr}} - {{logLevelName}} -> ",
        });
    }

    log(...args: unknown[]) {
        this.logger.info(...args);
    }

    warn(...args: unknown[]) {
        this.logger.warn(...args);
    }

    error(...args: unknown[]) {
        this.logger.error(...args);
    }
}

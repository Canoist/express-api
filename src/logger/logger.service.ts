import { Logger, BaseLogger } from "tslog";

export class LoggerService {
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

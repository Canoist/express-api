import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import IConfigService from "./config.service.interface";

// Важно добавить для работы inversify библиотеку reflect-metadata
import "reflect-metadata";

@injectable()
export default class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();
        if (result.error) {
            this.logger.error("[ConfigService] Не удалось прочитать файл .env или он отсутствует");
        } else {
            this.logger.log("[ConfigService] Конфигурация .env заугружена");
            this.config = result.parsed as DotenvParseOutput;
        }
    }
    get(key: string): string {
        return this.config[key];
    }
}

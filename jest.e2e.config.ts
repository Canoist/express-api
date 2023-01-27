import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    verbose: true,
    testRegex: ".e2e-spec.ts$",
};

export default config;

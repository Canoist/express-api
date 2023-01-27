import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    verbose: true,
    rootDir: "./tests",
    testRegex: ".e2e-spec.ts$",
};

export default config;

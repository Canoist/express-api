import { App } from "../src/app";
import { boot } from "../src/main";
import request from "supertest";

let application: App;

beforeAll(async () => {
    const { app } = await boot;
    application = app;
});

describe("Users e2e", () => {
    it("Register-error", async () => {
        const res = await request(application.app)
            .post("/users/register")
            .send({ name: "Bolfd", email: "b@4.ru", password: "somePassword" });

        expect(res.statusCode).toBe(422);
    });

    it("Login-success", async () => {
        const res = await request(application.app)
            .post("/users/login")
            .send({ email: "b@4.ru", password: "somePassword" });

        expect(res.statusCode).toBe(200);
        expect(res.body.jwt).not.toBeUndefined();
    });

    it("Login-error", async () => {
        const res = await request(application.app)
            .post("/users/login")
            .send({ email: "b@4.ru", password: "someWrongPassword" });

        expect(res.statusCode).toBe(401);
    });

    it("info-success", async () => {
        const { body } = await request(application.app)
            .post("/users/login")
            .send({ email: "b@4.ru", password: "somePassword" });

        const res = await request(application.app)
            .get("/users/info")
            .set("Authorization", "Bearer " + body.jwt)
            .send({ email: "b@4.ru", password: "somePassword" });

        expect(body.jwt).not.toBeUndefined();

        expect(res.statusCode).toBe(200);
        expect(res.body.email).not.toBeUndefined();
    });

    it("info-error", async () => {
        const { body } = await request(application.app)
            .get("/users/login")
            .set({})
            .send({ email: "b@4.ru", password: "somePassword" });

        const res = await request(application.app)
            .get("/users/info")
            .set("Authorization", "Bearer " + body.jwt + "error")
            .send({ email: "b@4.ru", password: "somePassword" });

        expect(res.statusCode).toBe(401);
    });
});

afterAll(async () => {
    application.close();
});

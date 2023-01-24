import { compare, hash } from "bcryptjs";

export class User {
    private _password: string;
    constructor(
        private readonly _email: string,
        private readonly _name: string,
        passwordHash?: string,
    ) {
        if (passwordHash) {
            this._password = passwordHash;
        }
    }

    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
    }

    get password(): string {
        return this._password;
    }

    public async setPassword(newPassword: string, salt: number | string): Promise<void> {
        this._password = await hash(newPassword, salt);
    }

    public async comparePassword(password: string): Promise<boolean> {
        return await compare(password, this._password);
    }
}

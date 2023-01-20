import "reflect-metadata";

function Injectable(key: string) {
    return (target: Function) => {
        Reflect.defineMetadata(key, { from: "define meta data" }, target);
        const meta = Reflect.getMetadata(key, target);
        console.log(meta);
    };
}

function Prop(target: Object, name: string) {}

@Injectable("C")
class C {
    @Prop prop: number;
}

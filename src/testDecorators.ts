function Component(id: number) {
    console.log("init Component"); // Выводится 4ым
    return (target: Function) => {
        console.log("run Component"); // Выводится 5ым
        target.prototype.id = id;
    };
}

function Logger() {
    console.log("init Logger"); // Выводится 3ым
    return (target: Function) => {
        console.log("run Logger"); // Выводится 7ым
    };
}

function Method(
    target: Object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
) {
    console.log(propertyKey); // Выводится 2ым
    propertyDescriptor.value = function (...args: any[]) {
        return args[0] * 10;
    };
}

function Prop(target: Object, propertyKey: string) {
    let value: number;
    const getter = () => {
        console.log("Getter"); // Добавили функциональность здесь
        // Выводится 6ым
        return value;
    };
    const setter = (newValue: number) => {
        console.log("Setter"); // Добавили функциональность здесь
        // Выводится 8ым
        value = newValue;
    };
    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
    });
}

function Param(target: Object, propertyKey: string, index: number) {
    console.log(propertyKey, index); // Выводится 1ым
}

@Logger()
@Component(1)
class User {
    @Prop id: number;

    @Method
    updateId(@Param newId: number) {
        this.id = newId;
        return this.id;
    }
}

console.log(new User().id); // Выводится 9ым - 1
console.log(new User().updateId(2)); // Выводится 10ым - 20

/*
updateId 0
updateId
init Logger
init Component
run Component
Setter
run Logger
Getter
1
20
*/

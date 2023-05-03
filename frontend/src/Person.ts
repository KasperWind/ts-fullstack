import { HasFormatter } from "./Formatters.js";

export class Person implements HasFormatter {
    constructor (readonly first: string, readonly last: string){}

    format():string {

        return `Firstname: ${this.first}, Lastname: ${this.last}, Full:${this.first} ${this.last} `
    }

    only_first():string {
        return this.first
    }
}


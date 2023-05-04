import { HasFormatter } from "./Formatters.js";
import { ListTemplate } from "./Templates.js";

export class Person implements HasFormatter {
    constructor (readonly first: string, readonly last: string){}

    format():string {

        return `Firstname: ${this.first}, Lastname: ${this.last}, Full:${this.first} ${this.last} `
    }

    only_first():string {
        return this.first
    }
}

export function renderPersons(listName:string) {

const persons: Person[]  = [
    new Person('Kasper', 'Wind')
    ,new Person('Xiulian', 'Chen')
    ,new Person('Eva', 'Wind')
    ,new Person('Daniel', 'Wind')
    ,new Person('Milo', 'Wind')
]

const list = document.getElementsByClassName(listName).item(0) as HTMLUListElement
if (list) {
    const render  = new ListTemplate(list)
    persons.forEach(element => {
        
        render.render(element, "Family members",  (element.first === 'Eva' ? 'start' : 'end'))
        
    });
}
}

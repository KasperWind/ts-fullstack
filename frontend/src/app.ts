import {HasFormatter} from './Formatters.js'
import {ListTemplate} from './Templates.js'
import {Invoice, Payment} from './Domain.js'

// import {Person} from './Person.js'
//
// const persons: Person[]  = [
//     new Person('Kasper', 'Wind')
//     ,new Person('Xiulian', 'Chen')
//     ,new Person('Eva', 'Wind')
//     ,new Person('Daniel', 'Wind')
//     ,new Person('Milo', 'Wind')
// ]
//
// const list = document.getElementsByClassName('item-list').item(0) as HTMLUListElement
// if (list) {
//     const render  = new ListTemplate(list)
//     persons.forEach(element => {
//         
//         render.render(element, "Family members",  (element.first === 'Eva' ? 'start' : 'end'))
//         
//     });
// }

const form = document.querySelector('.new-item-form') as HTMLFormElement

//inputs
const type = document.querySelector('#type') as HTMLInputElement
const tofrom = document.querySelector('#tofrom') as HTMLInputElement
const details = document.querySelector('#details') as HTMLInputElement
const amount = document.querySelector('#amount') as HTMLInputElement

// list
const ul = document.querySelector('ul')!;
const list = new ListTemplate(ul)

form.addEventListener('submit', formSubmit)
// form.addEventListener('submit', (e: Event) => {
//
// })

const app_name = 'finance_app'

//Cookie
let cookies = document.cookie

if (cookies === '' || !cookies.includes(app_name)) {
    createAppCookie()
}

let data:(Payment| Invoice)[]

if (cookies.includes(app_name)) {
    console.log('finance app')
    let app_data = cookies.split('; ').find((row) => row.startsWith(app_name))?.slice(app_name.length + 1)
    if (app_data === undefined) {
        createAppCookie()
    }
    else {
        let json = undefined
        try {
            json = JSON.parse(app_data)
            
        } catch (Error) {
            console.log('app data not valid json')
            createAppCookie()
        }
        if (json === undefined || !Array.isArray(json)) {
            console.log('app data not valid')
            createAppCookie()
        } else {
            data = json.map((row) => {
                let p  = Payment.fromObject(row)
                if (p) {
                    return p
                }
                let i  = Invoice.fromObject(row)
                if (i) {
                    return i
                }
                return undefined
            })
            .filter((row) => row !== undefined) as (Payment | Invoice)[]
            if(data.length > 0) {
                data.forEach((row) => {
                    let t = 'Invoice'
                    if(row instanceof Payment) {
                        t = 'Payment'
                    }
                    list.render(row, t, 'end')
                })
            }
        }
    }

}

function saveData() {
    const newCookie = app_name + '=' + JSON.stringify(data)  + '; Secure; max-age=3600; SameSite=Lax'
    document.cookie = newCookie
    cookies = document.cookie
}

function createAppCookie(){
    const newCookie = app_name + '=' + JSON.stringify([])  + '; Secure; max-age=3600; SameSite=Lax'
    document.cookie = newCookie
    cookies = document.cookie
    console.log('finance app cookie created')
}

function formSubmit(e: Event) {
    e.preventDefault()

    let values: [string, string, number]
    values = [tofrom.value, details.value, amount.valueAsNumber]

    let doc: HasFormatter
    if (type.value === 'invoice') {
        const i  = new Invoice(...values )
        data.push(i)
        doc = i
    } else {
        const p = new Payment(...values)
        data.push(p)
        doc = p
    }
    list.render(doc, type.value, 'end')
    saveData()
}

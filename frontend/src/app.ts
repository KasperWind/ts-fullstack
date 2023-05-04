import {HasFormatter} from './Formatters.js'
import {ListTemplate} from './Templates.js'
import {Invoice, Payment} from './Domain.js'

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
//let data:(Payment| Invoice)[]

window.onload = (ev: Event) => {
    getAllData().then((data:(Payment|Invoice)[]) =>{
        if(data.length > 0) {
            data.forEach((row:(Payment|Invoice)) => {
                let t = 'Invoice'
                if(row instanceof Payment) {
                    t = 'Payment'
                }
                list.render(row, t, 'end')
            })

        }
    })
}

async function getAllData() : Promise<(Payment | Invoice)[]> {
    const result = await fetch('http://127.0.0.1:5002/api/all')
    const json = await result.json()
     
    if (json === undefined || !Array.isArray(json)) {
        console.error('recieved data is not a valid json array', json )
        return []
    } else {
        let data = json.map((row) => {
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
        return data
    }
}


function formSubmit(e: Event) {
    e.preventDefault()

    let values: [string, string, number]
    values = [tofrom.value, details.value, amount.valueAsNumber]

    renderList(values)

}

function renderList(values: [string, string, number]){

    console.log(values)
    let doc: HasFormatter
    if (type.value === 'invoice') {
        const i  = new Invoice(...values )
        doc = i
    } else {
        const p = new Payment(...values)
        doc = p
    }
    list.render(doc, type.value, 'end')
}

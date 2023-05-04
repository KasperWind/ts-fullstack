import { Invoice, Payment } from "./Domain"

const app_name = 'finance_app'

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
                    // list.render(row, t, 'end')
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


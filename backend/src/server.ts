import {Client} from 'pg'
import { Invoice, Payment, fromObject} from './Domain'
import { on } from 'events'
const DB = process.env.DB
const PORT  = process.env.PORT 
const PWD = process.env.PASSWORD
const USER = process.env.PG_USER


async function getAll() : Promise<(Payment | Invoice)[] | undefined> {
    const client = new Client({"user":USER, "password":PWD, "database": DB})
    await client.connect()
 
    let t = new Array<Payment | Invoice>()
    try {
        const res = await client.query('SELECT to_from, details, type, amount FROM finance')
        res.rows.forEach((r) => {
            if (r.type === 'invoice') {
                const i = new Invoice(r.to_from, r.details, r.amount)
                t.push(i)
            } else if (r.type === 'payment') {
                const p = new Payment(r.to_from, r.details, r.amount)
                t.push(p)
            }
        })

    } catch (err) {
        console.error(err);
    } finally {
        await client.end()
    }
    return t
}

const BASE_PATH = "./dist/public"

const _server = Bun.serve({
    port: PORT,
    async fetch(request) {
        const uri = new URL(request.url)
        if (uri.pathname.startsWith("/api/")) {
            if (uri.pathname === "/api/all" && request.method === "GET") {
                const all = await getAll()
                console.log("/api/all", all)
                if (all) {
                    return new Response(JSON.stringify(all), {status:200})
                } else {
                    return new Response(null, {status: 500})
                }
            }
            if (uri.pathname === "/api/insert" && request.method === "POST") {
                let json = await request.json() as any[]

                if (!Array.isArray(json)) {
                    json = [json]
                } 

                console.log("/api/insert", json)

                const entries = json.map((a) => {
                    return fromObject(a);
                }).filter((e) => {return e !== undefined}) as (Payment | Invoice)[]

                console.log(entries)

                const client = new Client({"user":USER, "password":PWD, "database": DB})
                await client.connect()
             
                let resp = undefined
                try {
                    for await (let e of entries) {
                        let sql = ''
                        if (typeof(e) === typeof(Invoice)) {
                            let i = e as Invoice
                            sql = `INSERT INTO "finance" (to_from, details, type, amount) VALUES ('${i.client}', '${i.details}', 'invoice', ${i.amount});`
                        } else {
                            let i = e as Payment
                            sql = `INSERT INTO "finance" (to_from, details, type, amount) VALUES ('${i.recipient}', '${i.details}', 'payment', ${i.amount});`

                        }
                        const _res = await client.query(sql)
                    }

                    resp =  new Response(JSON.stringify([]), {status: 200})

                } catch (err) {
                    console.error(err);
                    resp = new Response(null, {status: 500})
                } finally {
                    await client.end()
                }

                return resp

            }
            return new Response(null, {status: 404})
        }
        else if (request.method === "GET"){
            if (uri.pathname === "/") {
                const file = Bun.file(BASE_PATH + "/index.html")
                return new Response(file)
            }
            const file = Bun.file(BASE_PATH + uri.pathname)
            if (file !== undefined && file !== null) {
                return new Response(file)
            }
            return new Response(null, {status: 404})
        }

        return new Response(null, {status: 404})
    }
    
})

console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)


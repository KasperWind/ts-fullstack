import {Client} from 'pg'
import { Invoice, Payment, fromObject } from './Domain'
const DB = process.env.DB
const COLL = 'Finances'
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

const server = Bun.serve({
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
                console.log("/api/insert", request.body)
                // const database = client.db(DB)
                // const finances = database.collection<(Payment | Invoice)>(COLL)
                //
                // if (Array.isArray(request.body)) {
                //     console.log('isArray',  request.body)
                //     return new Response(null, {status: 404})
                //
                // } else {
                //     const obj = fromObject(request.body)
                //
                //     if (obj){
                //         const result = await finances.insertOne(obj)
                //         console.log(`A document was inserted with the _id: ${result.insertedId}`)
                //         return new Response(JSON.stringify([]), {status:200})
                //     } else {
                //         console.log('Couldnt parse request')
                //         return new Response(null, {status: 405})
                //     }
                // }
                return new Response(null, {status: 404})
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


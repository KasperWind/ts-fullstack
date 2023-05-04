import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { Invoice, Payment } from './Domain'

dotenv.config()

const app: Express = express()
const port = process.env.PORT
const uri = process.env.MONGODB


async function run() {
    const client = new MongoClient(uri!)

    const db = client.db("sample-data")
    const supplies = db.collection("sample_suppliers")

    const query = { storeLocation: "Denver"}
    const options = {}

    const sale = await supplies.findOne(query, options)
    // console.log(sale)
}

const result:(Invoice|Payment)[] = [new Invoice('Kasper', 'some stuff', 100 ), new Payment('Kasper', 'some more stuff', 200)]

run().catch(console.dir)

app.use(cors())
app.use(express.static('./dist/public'))

app.get('/api/all', (req: Request, res: Response) => {
    res.status(200).send(JSON.stringify(result))
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

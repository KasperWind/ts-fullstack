import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { Invoice, Payment, fromObject } from './Domain'

const DB = 'FinanceApp'
const COLL = 'Finances'

dotenv.config()

const app: Express = express()
const port = process.env.PORT
const uri = process.env.MONGODB
const client = new MongoClient(uri!)

async function getAll() : Promise<(Payment | Invoice)[]> {

    const db = client.db(DB)
    const supplies = db.collection<(Payment | Invoice)>(COLL)

    const query = { }
    const options = {}

    const suppliers = supplies.find<(Payment | Invoice)>(query, options)
    
    if (await supplies.countDocuments(query) === 0) {
        return []
    } else {
         return await suppliers.toArray()
    }

}

app.use(cors())
app.use(express.json())
app.use(express.static('./dist/public'))

app.get('/api/all', async (req: Request, res: Response) => {
    const all = await getAll()
    res.status(200).send(JSON.stringify(all))
})

app.post('/api/insert', async (req: Request, res: Response) => {
    const database = client.db(DB)
    const finances = database.collection<(Payment | Invoice)>(COLL)

    if (Array.isArray(req.body)) {
        console.log('isArray',  req.body)
        res.sendStatus(404)

    } else {
        const obj = fromObject(req.body)

        if (obj){
            const result = await finances.insertOne(obj)
            console.log(`A document was inserted with the _id: ${result.insertedId}`)
            res.status(200).send(JSON.stringify([]))
        } else {
            console.log('Couldnt parse request')
            res.sendStatus(405)
        }
    }


})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

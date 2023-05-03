import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

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
    console.log(sale)
}

run().catch(console.dir)
app.use(express.static('./dist/public'))

app.get('/mjello', (req: Request, res: Response) => {
    res.send('Mjello ')
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

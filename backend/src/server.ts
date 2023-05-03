import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.static('public'))

app.get('/mjello', (req: Request, res: Response) => {
    res.send('Mjello ')
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

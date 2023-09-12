import {Client} from 'pg'

async function admin():Promise<boolean> {
    const client = new Client({"user":"postgres", "password":"welcome"})

    await client.connect()
    let done = true;
    try {
        const file = await Bun.file('./dev_initial/00-recreate-db.sql').text()
        const files = file.split('\n').filter((s)=> {return !(s.startsWith('--') || s === "")})

        for await (const entry of files) {
            console.log("adming executing: ", entry)
            const result = await client.query(entry)
            console.log("admin", result)
        }

    } catch (e) {
        done = false
        console.log('admin', e)
    } finally {
        await client.end();
        console.log('adming done')
    }
    
    return done
}

async function create(): Promise<boolean> {
    const client = new Client({"user":"app_user", "password":"dev_only_pwd", "database": "app_db"})

    let done = true
    await client.connect()
    try {
        const file = await Bun.file('./dev_initial/01-create-schema.sql').text()
        const files = file.split('\n').filter((s)=> {return !(s.startsWith('--') || s === "")})

        for await (const entry of files) {
            console.log("create executing: ", entry)
            const result = await client.query(entry)
            console.log("create", result)
        }

    } catch (e) {
        console.log('create', e)
        done = false
    } finally {
        await client.end();
    }
    return done
}

async function seed(): Promise<boolean> {
    const client = new Client({"user":"app_user", "password":"dev_only_pwd", "database": "app_db"})

    let done = true
    await client.connect()
    try {
        const file = await Bun.file('./dev_initial/02-dev-seed.sql').text()
        const files = file.split('\n').filter((s)=> {return !(s.startsWith('--') || s === "")})

        for await (const entry of files) {
            console.log("seed executing: ", entry)
            const result = await client.query(entry)
            console.log("seed", result)
        }

    } catch (e) {
        console.log('seed', e)
        done = false
    } finally {
        await client.end();
    }
    return done
}

let done = await admin()
console.log("admin", done)
if (done) {
    let createDone = await create()
    console.log("create", createDone)
    if (createDone) {
        let seedDone = await seed()
        console.log("seed", seedDone)
    }
}

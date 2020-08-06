const keys = require('./keys')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const { Pool } = require('pg')
const { pgHost, pgUser, pgDatabase, pgPassword, pgPort } = keys
const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort,
})

pgClient.connect().then(() => {
  pgClient.query(`CREATE TABLE IF NOT EXISTS values (number INT)`)
          .catch(e => console.log(e))
})

pgClient.on(`error`, () => console.log(`Lost PG connection`))

const redis = require('redis')
const { redisHost, redisPort } = keys
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
})

const redisPublisher = redisClient.duplicate()

app.get(`/`, (req, res) => res.send(`Hi`))

app.get(`/values/all`, async (req, res) => {
  try {
    const values = await pgClient.query(`SELECT * FROM values`)
    res.send(values.rows)
  } catch (e) {
    res.send([])
  }
})

app.get(`/values/current`, async (req, res) => {
  redisClient.hgetall(`values`, (err, values) => {
    res.send(values)
  })
})

app.post(`/values`,async (req, res) => {
  const { index } = req.body
  if (parseInt(index) > 40) {
    return res.status(422).send({ message: `Index too high` })
  }
  redisClient.hset(`values`, index,  `Nothing yet!`)
  redisPublisher.publish(`insert`, index)
  try {
    await pgClient.query(`INSERT INTO values(number) VALUES($1)`, [index])
    res.send({ working: true })
  } catch (e) {
    res.status(500).send({ working: false })
  }
})

app.listen(5000, () => console.log(`Listening on port 5000`))

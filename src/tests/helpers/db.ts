import mongoose from 'mongoose'

const DATABASE_URI = `${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`

let cachedClient: mongoose.Connection
let cachedDb: mongoose.Connection['db']

export const getDB = async () => {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  return mongoose.connect(DATABASE_URI).then((client) => {
    cachedClient = client.connection
    cachedDb = client.connection.db
    return { client, db: cachedDb }
  })
}

export const cleanDB = async () => {
  const { db } = await getDB()
  return db.dropDatabase()
}

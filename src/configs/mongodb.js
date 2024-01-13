import { MongoClient, ServerApiVersion } from 'mongodb'
import { MONGODB as ENV_MONGODB } from './environment'

const mongoClient = new MongoClient(ENV_MONGODB.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

let trelloDatabaseInstance = null

export const connectDB = async () => {
  await mongoClient.connect()
  trelloDatabaseInstance = mongoClient.db(ENV_MONGODB.DATABASE_NAME)
}

export const closeDB = async () => {
  await mongoClient.close()
}

export const getDB = () => {
  if (!trelloDatabaseInstance) throw new Error('Connect to database first!')
  return trelloDatabaseInstance
}

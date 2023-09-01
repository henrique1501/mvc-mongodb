import { MongoClient, ServerApiVersion } from 'mongodb'

export const mongodb = new MongoClient(
  'mongodb+srv://henrique_root:B5aV0ASZjD62WwGS@mvc-mongo.op0isnm.mongodb.net/?retryWrites=true&w=majority',
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  },
)

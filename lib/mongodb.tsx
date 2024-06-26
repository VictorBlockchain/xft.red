// mongodb.js

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}
let client:any
let clientPromise:any
if (!process.env.MONGODB_URI) {
    throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {

    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri, options);
        (global as any)._mongoClientPromise = client.connect();
      }

    // if (!global._mongoClientPromise) {
    //     client = new MongoClient(uri, options)
    //     global._mongoClientPromise = client.connect()
    // }
    clientPromise = (global as any)._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise;

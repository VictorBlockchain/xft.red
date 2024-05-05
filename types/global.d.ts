// types/global.d.ts
import { MongoClient } from 'mongodb';

export {};

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient> | undefined;
    }
  }
}

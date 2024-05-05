// types/global.d.ts
import { MongoClient } from "mongodb";

export {}; // Ensure this file is a module

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient>;
    }
  }
}

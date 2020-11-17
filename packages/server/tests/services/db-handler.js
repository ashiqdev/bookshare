import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database
 */

const connect = async () => {
  const uri = await mongod.getUri();

  const mongodbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  await mongoose.connect(uri, mongodbOptions);
};

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
  const { collections } = mongoose.connection;

  // eslint-disable-next-line guard-for-in
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

export { connect, closeDatabase, clearDatabase };

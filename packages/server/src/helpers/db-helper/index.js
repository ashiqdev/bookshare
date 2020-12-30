/* eslint-disable import/prefer-default-export */
import mongoose from "mongoose";

// remove hardcoded database uri
const { DATABASE } = process.env;

// connect to db
export const connectWithDb = () => {
  const mongodbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose.connect(DATABASE, mongodbOptions, (err) => {
    if (err) {
      throw err;
    }
  });
};

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

  mongoose.connect("mongodb://127.0.0.1:27017/boi", mongodbOptions, (err) => {
    if (err) {
      throw err;
    }
  });
};

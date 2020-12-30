import express from "express";
import cors from "cors";
import morgan from "morgan";
import configureRoutes from "./controllers";
import { processRequest, handleErrors } from "./middlewares";
import { errorLogger, infoLogger } from "./logger";
import { NotFound } from "./utils/errors";

const swaggerUI = require("swagger-ui-express");

// create express app
const app = express();

// set up cors to handle request from frontend
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(processRequest);

// this is for viewing clean http request in console
if (process.env.ENVIRONMENT !== "test") app.use(morgan("dev"));

if (process.env.ENVIRONMENT !== "test") app.use(infoLogger());

configureRoutes(app);

if (process.env.ENVIRONMENT !== "test")
  app.use(errorLogger(process.env.DATABASE));

const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// not found error handle [this middlware handles the not found routes]
const notFound = () => {
  throw new NotFound("Not Found");
};
app.use(notFound);

app.use(handleErrors);

export default app;

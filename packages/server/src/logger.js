import winston from "winston";
import expressWinston from "express-winston";
import winstonFile from "winston-daily-rotate-file";
import winstonMongo from "winston-mongodb";
import { ElasticsearchTransport } from "winston-elasticsearch";

// mongo logger
const mongoErrorTransport = (uri) =>
  new winston.transports.MongoDB({
    db: uri,
    metaKey: "meta",
  });

// es logger
const esOptions = {
  level: "info",
  clientOpts: { node: "http://localhost:9200" },
  indexPrefix: "log-boi",
};

const esTransport = new ElasticsearchTransport(esOptions);

// generate message for logger
const getMessage = (req) => {
  const obj = {
    correlationId: req.headers["x-correlation-id"],
    requestBody: req.body,
  };

  return JSON.stringify(obj);
};

const infoLogger = () =>
  expressWinston.logger({
    transports: [
      new winston.transports.DailyRotateFile({
        dirname: "./logs",
        filename: "log-info-%DATE%.log",
        datePattern: "yyyy-MM-DD-HH",
      }),
      esTransport,
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false,
    msg: getMessage,
  });

const errorLogger = (uri) =>
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.DailyRotateFile({
        dirname: "./logs",
        filename: "log-error-%DATE%.log",
        datePattern: "yyyy-MM-DD-HH",
      }),
      mongoErrorTransport(uri),
      esTransport,
    ],

    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),

    meta: true,
    msg:
      '{"correlationId": "{{req.headers["x-correlation-id"]}}", "error": "{{err.message}}" }',
  });

export { infoLogger, errorLogger };

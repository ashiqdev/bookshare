import app from "./app";
import { connectWithDb } from "./helpers/db-helper";

const { API_PORT } = process.env;

app.set("port", API_PORT || 7777);
const server = app.listen(app.get("port"), () => {
  if (process.env.ENVIRONMENT !== "test") {
    connectWithDb();
  }

  console.log(`Express running → PORT ${server.address().port}`);
});

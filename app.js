const express = require("express");
const app = express();

module.exports = app;
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

let db;
const initializeAndStartServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () =>
      console.log("server is running at http://localhost:3000/")
    );
  } catch {
    console.log(`db error ${e.message}`);
    process.exit(1);
  }
};
initializeAndStartServer();

//get method

app.get("/todos/", async (request, response) => {
  let { status, priority, search_q = "" } = request.query;

  let details = null;
  let getQuery = null;

  if (priority !== undefined && status !== undefined) {
    getQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%' AND
        status = '${status}'
        AND priority = '${priority}';`;
  } else if (status !== undefined) {
    getQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND status = "${status}" ;`;
  } else if (priority !== undefined) {
    getQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'AND priority = "${priority}";`;
  } else {
    getQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
  }
  details = await db.all(getQuery);
  response.send(details);
});

const neo4j = require("neo4j-driver");

const { NEO4J_USER } = process.env;
const { NEO4J_PASSWORD } = process.env;
const port = process.env.NEO4J_BOLT_PORT;
const NEO4J_BOLT_URL = `bolt://localhost:${port}`;

let driver = null;

function getNeo4jSession() {
  const driverObj = neo4j.driver(NEO4J_BOLT_URL, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
  driver = driverObj;
  const session = driverObj.session();
  return session;
}

async function runNeo4jQuery(query, queryParams) {
  const session = getNeo4jSession();
  const result = await session.run(
    query,
    { ...queryParams },
  );
  if (driver) {
    await session.close();
    // on application exit:
    await driver.close();
  }
  return result;
}

module.exports = { runNeo4jQuery };

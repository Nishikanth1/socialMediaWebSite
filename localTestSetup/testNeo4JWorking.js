const { runNeo4jQuery } = require("../modules/friends/service/neo4jHelpers");

const personName = "Alice";

(async function runNeo4jcheck() {
  const result = await runNeo4jQuery(
    "MERGE (a:Person {name: $name}) RETURN a",
    { name: personName },
  );

  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.name);
}());

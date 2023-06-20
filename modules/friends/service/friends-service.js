const neo4jHelpers = require("./neo4jHelpers");
// in graph we use userid as id, to avoid confusion with inbuild id property

async function createFollow(request, response, logger) {
  const { fromUserId, toUserId } = request.body;
  const query = `MATCH (from:User {userid: $fromUserId}), (to:User {userid: $toUserId}) 
                 CREATE (from)-[r:FOLLOWS]->(to)
                 RETURN r`;
  const params = { fromUserId, toUserId };
  const data = await neo4jHelpers.runNeo4jQuery(query, params);
  const message = `user ${fromUserId} is now follwing ${toUserId}`;
  return response.status(200).send({ message, data });
}

async function createUser(request, response, logger) {
  const { id, email } = request.body;
  const query = `MERGE (userNode:User {userid: $id})
                 ON CREATE SET userNode.email = $email
                RETURN userNode`;
  const params = { id, email };
  const data = await neo4jHelpers.runNeo4jQuery(query, params);
  const message = `Successfully create user ${id} ${email}`;
  return response.status(200).send({ message, data });
}

module.exports = { createFollow, createUser };

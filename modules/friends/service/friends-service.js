const neo4jHelpers = require("./neo4jHelpers");
// in graph we use userid as id, to avoid confusion with inbuild id property

async function createFollow(request, response, logger) {
  const { fromUserId, toUserId } = request.body;
  const query = `MATCH (from:User {userid: $fromUserId}), (to:User {userid: $toUserId}) 
                 CREATE (from)-[r:FOLLOWS]->(to)
                 RETURN r`;
  const params = { fromUserId, toUserId };
  const result = await neo4jHelpers.runNeo4jQuery(query, params);
  const message = `user ${fromUserId} is now follwing ${toUserId}`;
  logger.info(`result is ${JSON.stringify(result)}`);
  // eslint-disable-next-line dot-notation
  const updatedRels = result.summary.updateStatistics["_stats"].relationshipsCreated;

  if (updatedRels !== 1) {
    return response.status(500).send({ message: `Unable to create follow from ${fromUserId} to ${toUserId}` });
  }
  return response.status(200).send({ message, data: { updatedRelationships: updatedRels } });
}

async function deleteFollow(request, response, logger) {
  const { fromUserId, toUserId } = request.params;
  const query = `MATCH (from:User {userid: $fromUserId})-[r:FOLLOWS]->(to:User {userid: $toUserId}) 
                 DELETE r`;
  const params = { fromUserId, toUserId };
  const data = await neo4jHelpers.runNeo4jQuery(query, params);
  const message = `user ${fromUserId} unfollwed ${toUserId}`;
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

async function deleteUser(request, response, logger) {
  const { id } = request.params;
  const query = `MATCH (userNode:User {userid: $id})
                 DETACH DELETE userNode`;
  const params = { id };
  const data = await neo4jHelpers.runNeo4jQuery(query, params);
  const message = `Successfully deleted user ${id}`;
  return response.status(200).send({ message, data });
}

module.exports = {
  createFollow, createUser, deleteUser, deleteFollow,
};

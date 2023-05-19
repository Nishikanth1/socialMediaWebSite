const dbConnector = require("../../../../dbconnector/connector");

async function routes(fastify, options) {
  fastify.get("/users", async (request, reply) => await dbConnector.testDbConnection(request.log));
}

module.exports = routes;

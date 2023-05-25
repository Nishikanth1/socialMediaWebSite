const dbConnector = require("../../../../dbconnector/connector");
const { addUser } = require("../../controller/user");

async function routes(fastify, options) {
  fastify.post("/user", async (request, response) => addUser(request, response, request.log));

  fastify.get("/users", async (request, response) => dbConnector.testDbConnection(request.log));
}

module.exports = routes;

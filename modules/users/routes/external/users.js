const dbConnector = require("../../../../dbconnector/connector");
const userController = require("../../controller/user");

async function routes(fastify, options) {
  fastify.get("/user/:id", async (request, response) => userController.getUser(request, response, request.log));
  fastify.get("/users", async (request, response) => userController.getAllUsers(request, response, request.log));
  fastify.post("/user", async (request, response) => userController.addUser(request, response, request.log));
}

module.exports = routes;

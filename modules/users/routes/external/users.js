const dbConnector = require("../../../../dbconnector/connector");
const userController = require("../../controller/user");
const { checkRoleIsAllowed } = require("../../../middlewares/rbac");
const { roles } = require("../../../helpers/roles");

async function routes(fastify, options) {
  fastify.get("/users/:id", { preHandler: checkRoleIsAllowed([roles.User, roles.Admin]) }, async (request, response) => userController.getUser(request, response, request.log));
  fastify.put("/users/:id", async (request, response) => userController.updateUser(request, response, request.log));
  fastify.patch("/users/:id", async (request, response) => userController.patchUser(request, response, request.log));
  fastify.get("/users", async (request, response) => userController.getAllUsers(request, response, request.log));
  fastify.post("/users", async (request, response) => userController.addUser(request, response, request.log));
  fastify.delete("/users/:id", async (request, response) => userController.deleteUser(request, response, request.log));
}

module.exports = routes;

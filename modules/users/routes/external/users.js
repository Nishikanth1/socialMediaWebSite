const userService = require("../../service/user");
const { checkPermissions } = require("../../../middlewares/rbac");
const { roles } = require("../../../helpers/roles");

async function routes(fastify, options) {
  fastify.get("/users/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => userService.getUser(request, response, request.log));
  fastify.put("/users/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => userService.updateUser(request, response, request.log));
  fastify.patch("/users/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => userService.patchUser(request, response, request.log));
  fastify.get("/users", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => userService.getAllUsers(request, response, request.log));
  fastify.post("/users", async (request, response) => userService.addUser(request, response, request.log));
  fastify.delete("/users/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => userService.deleteUser(request, response, request.log));
}

module.exports = routes;

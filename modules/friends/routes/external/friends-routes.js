const { checkPermissions } = require("../../../middlewares/rbac");
const { roles } = require("../../../helpers/roles");
const friendsService = require("../../service/friends-service");

async function routes(fastify, options) {
  fastify.post("/friends/follow", async (request, response) => friendsService.createFollow(request, response, request.log));
  fastify.post("/friends/user", async (request, response) => friendsService.createUser(request, response, request.log));
}

module.exports = routes;

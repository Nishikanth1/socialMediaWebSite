const { checkPermissions } = require("../../../middlewares/rbac");
const { roles } = require("../../../helpers/roles");
const friendsService = require("../../service/friends-service");

async function routes(fastify, options) {
  fastify.get("/friends/follow/:fromUser/:toUser", async (request, response) => friendsService.getFollow(request, response, request.log));
  fastify.get("/friends/follower/:fromUser", async (request, response) => friendsService.getAllFollowers(request, response, request.log));
  fastify.post("/friends/follow", async (request, response) => friendsService.createFollow(request, response, request.log));
  fastify.delete("/friends/follow/:fromUser/:toUser", async (request, response) => friendsService.deleteFollow(request, response, request.log));
  fastify.post("/friends/user", async (request, response) => friendsService.createUser(request, response, request.log));
  fastify.delete("/friends/user/:id", async (request, response) => friendsService.deleteUser(request, response, request.log));
}

module.exports = routes;

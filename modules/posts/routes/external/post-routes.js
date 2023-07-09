const postService = require("../../service/post-service");
const { checkPermissions, checkUserIsLogged } = require("../../../middlewares/rbac");
const { roles } = require("../../../helpers/roles");

async function routes(fastify, options) {
  fastify.get("/posts/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => postService.getPost(request, response, request.log));
  fastify.get("/users/posts/:userId", { preHandler: checkUserIsLogged() }, async (request, response) => postService.getUserPosts(request, response, request.log));
  fastify.delete("/posts/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => postService.deletePost(request, response, request.log));
  fastify.post("/posts", { preHandler: checkUserIsLogged() }, async (request, response) => postService.createPost(request, response, request.log));
  fastify.patch("/posts/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => postService.patchPost(request, response, request.log));
  fastify.put("/posts/:id", { preHandler: checkPermissions([roles.User, roles.Admin]) }, async (request, response) => postService.updatePost(request, response, request.log));
}

module.exports = routes;

const postService = require("../../service/post-service");

async function routes(fastify, options) {
  fastify.get("/posts/:id", async (request, response) => postService.getPost(request, response, request.log));
  fastify.get("/users/posts/:userId", async (request, response) => postService.getUserPosts(request, response, request.log));
  fastify.delete("/posts/:id", async (request, response) => postService.deletePost(request, response, request.log));
  fastify.post("/posts", async (request, response) => postService.createPost(request, response, request.log));
}

module.exports = routes;

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => ({ hello: "world" }));
}

module.exports = routes;

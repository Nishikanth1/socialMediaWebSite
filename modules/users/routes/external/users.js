async function routes(fastify, options) {
  fastify.get("/users", async (request, reply) => ({ users: ["User1", "User2"] }));
}

module.exports = routes;

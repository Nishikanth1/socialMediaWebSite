const authHelpers = require("../../controller/auth");

async function routes(fastify, options) {
  fastify.post("/authenticate", async (request, response) => authHelpers.authenicateUser(request, response, request.log));
}

module.exports = routes;

async function routes(fastify, options) {
  fastify.get('/', async (req, reply) => ({ hello: 'world' }));
}

module.exports = {
  routes,
};

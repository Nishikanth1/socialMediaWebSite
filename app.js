const fastify = require('fastify');

const buildapp = async () => {
  const app = fastify({
    logger: true,
  });
  return app;
};

module.exports = {
  buildapp,
};

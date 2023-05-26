const fastify = require("fastify");
const userRoutes = require("./modules/users/routes/external/users");
const homeRoutes = require("./modules/home/routes/external/routes");

const buildapp = async () => {
  const app = fastify({
    logger: true,
  });

  app.register(homeRoutes);
  app.register(userRoutes);

  return app;
};

module.exports = {
  buildapp,
};

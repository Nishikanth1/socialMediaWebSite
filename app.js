const fastify = require("fastify");
const userRoutes = require("./modules/users/routes/external/users");
const homeRoutes = require("./modules/home/routes/external/routes");
const authRoutes = require("./modules/auth/routes/external/routes");
const friendsRoutes = require("./modules/friends/routes/external/friends-routes");
const postRoutes = require("./modules/posts/routes/external/post-routes");

const buildapp = async () => {
  const app = fastify({
    logger: true,
  });

  app.register(authRoutes);
  app.register(homeRoutes);
  app.register(userRoutes);
  app.register(friendsRoutes);
  app.register(postRoutes);

  return app;
};

module.exports = {
  buildapp,
};

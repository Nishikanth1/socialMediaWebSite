const fastify = require("fastify");
const { buildapp } = require("./app");

const startApp = async () => {
  const PORT = process.env.PORT || 30000;
  const app = await buildapp();

  app.listen({ port: PORT }, (err, address) => {
    if (err) {
      app.log.error(`Starting serving Failed due ${err}`);
      process.exit(1);
    }
  });
};

startApp();

const { Sequelize } = require("sequelize");

const database = process.env.DATABASE_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbUrl = `postgres://${dbUser}:${dbPassword}@localhost:9000/${database}`;// process.env.POSTGRESQL_DB_URI;

const sequelize = new Sequelize(dbUrl, { dialect: "postgres" });

const testDbConnection = async (logger) => {
  try {
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
    return { isDBconnected: true };
  } catch (error) {
    logger.error(error, `Unable to connect to the database: ${error}`);
    return { isDBconnected: false };
  }
};

module.exports = { testDbConnection, sequelize };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../dbconnector/connector");

const env = process.env.NODE_ENV;

const Post = sequelize.define("post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT("long"),
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const forceCleanDb = process.env.CLEAR_DB;
console.log(`env is ${env}`);

async function syncModels() {
  await Post.sync({ force: forceCleanDb });
  console.log("Post Model synced");
}

if (env !== "DEVELOPMENT") {
  (async () => {
    await syncModels();
  })();
}

module.exports = { Post, syncModels };

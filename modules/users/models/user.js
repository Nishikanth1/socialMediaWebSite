const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../dbconnector/connector");

const env = process.env.NODE_ENV;
const genderEnums = ["M", "F", "O"];

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
  },

  gender: {
    type: DataTypes.ENUM(...genderEnums),

  },

  fullName: {
    type: DataTypes.STRING,
  },
  aboutMe: {
    type: DataTypes.STRING,
  },
});

const forceCleanDb = process.env.CLEAR_DB;
console.log(`env is ${env}`);

async function syncModels() {
  await User.sync({ force: forceCleanDb });
  console.log("User Model synced");
}

if (env !== "DEVELOPMENT") {
  (async () => {
    await syncModels();
  })();
}

module.exports = { User, syncModels };

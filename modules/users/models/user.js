const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../dbconnector/connector");

const env = process.env.NODE_ENV;
const genderEnums = ["M", "F", "O"];

const User = sequelize.define("user", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
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
if (env !== "DEVELOPMENT") {
  (async () => {
    await User.sync({ force: forceCleanDb });
    console.log("User Model synced");
  })();
}

module.exports = { User };
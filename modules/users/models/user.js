const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../dbconnector/connector");

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
    type: DataTypes.STRING,
  },

  fullName: {
    type: DataTypes.STRING,
  },
  aboutMe: {
    type: DataTypes.STRING,
  },
});

const forceCleanDb = process.env.CLEAR_DB;
User.sync({ force: forceCleanDb }).then(() => {
  console.log("User Model synced");
});

module.exports = User;

const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../../dbconnector/connector");

const env = process.env.NODE_ENV;
const genderEnums = ["M", "F", "O"];
const roleEnums = ["User", "Admin"];

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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
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
  role: {
    type: DataTypes.ENUM(...roleEnums),
    defaultValue: "User",
  },
});

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  console.log(`password ${user.password} hashedPassword ${hashedPassword}`);
  // eslint-disable-next-line no-param-reassign
  user.password = hashedPassword;
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

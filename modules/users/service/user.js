// eslint-disable-next-line import/no-extraneous-dependencies
const _ = require("lodash");
const axios = require("axios");
const { User } = require("../models/user");

const friendsServiceUrl = "http://127.0.0.1:30000";

async function getUser(request, response, logger) {
  try {
    const userId = request.params.id;
    const data = await User.findByPk(userId);
    console.log(`get data is ${JSON.stringify(data)}`);
    if (!data) {
      console.log(`DEBUG DEBUG DEBUG ${JSON.stringify(data)}`);
      return response.status(404).send("Resource Not found");
    }
    delete data.password;
    return response.status(200).send(data);
  } catch (error) {
    logger.error(error);
    return response.status(504).send({
      message:
      error.message || "Some error occurred while reading the user object.",
    });
  }
}

async function addUser(request, response, logger) {
  if (!request.body.email || !request.body.username) {
    return response.status(400).send({
      message: "Need both username and email",
    });
  }
  logger.info(`request body is ${JSON.stringify(request.body)}`);
  // Create an user
  const userObject = {
    email: request.body.email,
    username: request.body.username,
    age: request.body.age,
    gender: request.body.gender,
    fullName: request.body.fullName,
    aboutMe: request.body.aboutMe,
    password: request.body.password,
  };

  try {
    const existingUser = await User.findOne({ where: { email: userObject.email } });
    if (existingUser) {
      delete existingUser.password;
      return response.status(403).send(existingUser);
    }
    const data = await User.create(userObject);
    logger.info(`data from create is ${JSON.stringify(data)}`);
    if (data) {
      delete data.password;
    }
    const friendsResp = await axios.post(
      `${friendsServiceUrl}/friends/user`,
      {
        id: data.id,
        email: data.email,
      },
    );
    console.log(`friendsResp is ${JSON.stringify(friendsResp.data)}`);
    return response.status(201).send(data);
  } catch (error) {
    logger.error(error);
    return response.status(500).send({
      message:
      error.message || "Some error occurred while creating the user object.",
    });
  }
}

async function getAllUsers(request, response, logger) {
  try {
    const data = await User.findAndCountAll();
    return response.status(200).send(data);
  } catch (error) {
    logger.error(error);
    return response.status(504).send({
      message:
      error.message || "Some error occurred while reading the users object.",
    });
  }
}

async function updateUser(request, response, logger) {
  try {
    const userId = request.params.id;
    const where = { id: userId };
    const existingUser = await User.findOne({ where });
    if (!existingUser) {
      return response.status(404).send({ message: `User ${userId} not exists` });
    }
    const userObject = {
      email: request.body.email,
      username: request.body.username,
      age: request.body.age,
      gender: request.body.gender,
      fullName: request.body.fullName,
      aboutMe: request.body.aboutMe,
    };
    logger.info(`udpate user body is ${JSON.stringify(userObject)}`);
    const data = await User.update(userObject, { where });
    logger.info(`Update user ${userId} response is ${JSON.stringify(data)}`);
    return response.status(200).send({ isUpdated: true });
  } catch (error) {
    logger.error(error);
    return response.status(500).send({
      message:
      error.message || "Some error occurred while updating the user object.",
    });
  }
}

async function patchUser(request, response, logger) {
  try {
    const userId = request.params.id;
    const userObject = {
      email: request.body.email,
      username: request.body.username,
      age: request.body.age,
      gender: request.body.gender,
      fullName: request.body.fullName,
      aboutMe: request.body.aboutMe,
    };
    logger.info(`patch user body is ${JSON.stringify(userObject)}`);
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return response.status(404).send({ message: `User ${userId} not exists` });
    }
    const updatedUserData = _.merge({}, existingUser, userObject);
    const [updatedRowCount, updatedUsers] = await User.update(updatedUserData, {
      where: { id: userId },
      returning: true,
    });
    logger.info(`Patched user ${userId} response is ${JSON.stringify(updatedUsers)}`);
    return response.status(200).send({ isUpdated: true });
  } catch (error) {
    logger.error(error);
    return response.status(500).send({
      message:
      error.message || "Some error occurred while updating the user object.",
    });
  }
}

async function deleteUser(request, response, logger) {
  const userId = request.params.id;
  if (!userId) {
    return response.send(400).send(`Invalid user id ${userId}`);
  }
  try {
    const where = { id: userId };
    const existingUser = await User.findOne({ where });
    if (!existingUser) {
      return response.status(404).send({ message: `User ${userId} not exists` });
    }
    const data = await User.destroy({ where });
    return response.status(200).send({ message: `User ${userId} Deleted successfully`, data });
  } catch (error) {
    logger.error(error);
    return response.status(504).send({
      message:
      error.message || `Some error occurred while deleting the user object wiith id ${userId}.`,
    });
  }
}
module.exports = {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
};

const { User } = require("../models/user");

async function addUser(request, response, logger) {
  if (!request.body.email || !request.body.username) {
    response.status(400).send({
      message: "Need both username and email",
    });
    return;
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
  };

  try {
    const data = await User.create(userObject);
    logger.info(`data from create is ${JSON.stringify(data)}`);
    response.status(201).send(data);
  } catch (error) {
    logger.error(error);
    response.status(500).send({
      message:
      error.message || "Some error occurred while creating the user object.",
    });
  }
}

async function getAllUsers(request, response, logger) {
  try {
    const data = await User.findAndCountAll();
    logger.info(`data from get is ${JSON.stringify(data)}`);
    response.status(200).send(data);
  } catch (error) {
    logger.error(error);
    response.status(504).send({
      message:
      error.message || "Some error occurred while reading the user object.",
    });
  }
}
module.exports = { addUser, getAllUsers };

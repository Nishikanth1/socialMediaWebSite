const userModel = require("../models/user");

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
  };

  try {
    const data = await userModel.create(userObject);
    logger.info(`data from create is ${JSON.stringify(data)}`);
    response.send(data);
  } catch (error) {
    logger.error(error);
    response.status(500).send({
      message:
      error.message || "Some error occurred while creating the user object.",
    });
  }
}

module.exports = { addUser };

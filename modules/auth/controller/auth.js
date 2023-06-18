const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../users/models/user");

const SECRET = process.env.JWT_SECRET;
// eslint-disable-next-line consistent-return
async function authenticate(email, password) {
  const user = await User.findOne({ where: { email } });
  const storedPasswordHash = user.password;
  if (user) {
    const result = await bcrypt.compare(password, storedPasswordHash);
    console.log(`pwd result compare is ${result} jwt is ${JSON.stringify(jwt)}`);
    if (result) {
      const token = jwt.sign({ email: user.email, roles: [user.role] }, SECRET);
      return { auth: true, token };
    }
    return { auth: false };
  }
  console.log("User not found for authenticate");
}

async function authenicateUser(request, response, logger) {
  const { email, password } = request.body;
  const data = await User.findOne({ where: { email } });
  if (data == null) {
    logger.error("User not found");
    response.status(404).send("User not found");
  }
  const result = await authenticate(email, password);
  if (!result.auth) {
    response.status(401).send("Not Authenticated");
  }
  return response.status(200).send(result);
}

module.exports = {
  authenicateUser,
};

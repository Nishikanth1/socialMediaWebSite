const { jwt } = require("jsonwebtoken");
const { User } = require("../../users/models/user");

const SECRET = process.env.JWT_SECRET;

// eslint-disable-next-line consistent-return
async function authenticate(email, password) {
  const user = await User.findOne((u) => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign({ email: user.email, roles: [user.role] }, SECRET);
    return token;
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
  return authenticate(email, password);
}

module.exports = {
  authenicateUser,
};

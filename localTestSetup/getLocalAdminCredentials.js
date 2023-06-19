const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();

const { User, syncModels } = require("../modules/users/models/user");

chai.use(chaiHttp);
const session = {};

async function destroyUser(where) {
  await User.destroy({
    where: { ...where },
    truncate: true,
  });
}

async function createUser(userData) {
  await User.create({
    ...userData,
  });
}
const PORT = process.env.PORT || 30000;

async function authenticateUser(email, password) {
  const url = `http://127.0.0.1:${PORT}`;
  console.log(`URL is ${url}`);
  const res = await chai.request(url)
    .post("/authenticate")
    .send({ email, password });
  console.log(`authenticate res is ${res.text}`);
  res.should.have.status(200);
  return JSON.parse(res.text);
}

(async function getToken() {
  await destroyUser({ email: "test99@gmail.com" });
  const adminData = {
    email: "test99@gmail.com",
    username: "adminUser",
    age: 22,
    gender: "F",
    password: "abcd1234",
    role: "Admin",
  };
  await createUser(adminData);
  const authRes = await authenticateUser("test99@gmail.com", "abcd1234");
  session.token = authRes.token;
  console.log(`Admin User is ${JSON.stringify(adminData)} and token is ${authRes.token}`);
}());

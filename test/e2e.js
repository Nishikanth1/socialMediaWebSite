const chai = require("chai");
const chaiHttp = require("chai-http");
const constants = require("./const");
const { logger } = require("./e2elogger");
const { addAdminUser } = require("../localTestSetup/getLocalAdminCredentials");
const testData = require("./testData");

const { testUserData, testUserFriendData } = testData;

chai.use(chaiHttp);
const should = chai.should();
const adminSession = {};
const userSession = {};

const testSessionData = {};
before(async () => {
  const adminData = await addAdminUser();
  adminSession.token = adminData.token;
});

describe("Test User Creation and Auth", async () => {
  it("add single user", async () => {
    const response = await chai.request(constants.serviceUrl)
      .post(constants.userApi)
      .send(testUserData);
    logger.info(`response is ${JSON.stringify(response)}`);
    const data = JSON.parse(response.text);
    logger.info(`data is ${JSON.stringify(data)}`);
    data.should.have.property("id");
    data.should.have.property("email", testUserData.email);
    data.should.have.property("username", testUserData.username);
    data.should.have.property("age", testUserData.age);
    data.should.have.property("gender", testUserData.gender);
    data.should.have.property("fullName", testUserData.fullName);
    data.should.have.property("aboutMe", testUserData.aboutMe);
  });

  it("login by auth api", async () => {
    const response = await chai.request(constants.serviceUrl)
      .post(constants.authApi)
      .send(
        {
          email: testUserData.email,
          password: testUserData.password,
        },
      );
    logger.info(`auth response is ${JSON.stringify(response)}`);
    const data = JSON.parse(response.text);
    data.should.have.property("auth", true);
    data.should.have.property("token");
    userSession.token = data.token;
  });

  it("add single user (for friend creation)", async () => {
    const response = await chai.request(constants.serviceUrl)
      .post(constants.userApi)
      .send(testUserFriendData);
    logger.info(`response is ${JSON.stringify(response)}`);
    const data = JSON.parse(response.text);
    logger.info(`data is ${JSON.stringify(data)}`);
    testSessionData.friendId = data.id;
    data.should.have.property("id");
    data.should.have.property("email", testUserFriendData.email);
    data.should.have.property("username", testUserFriendData.username);
    data.should.have.property("age", testUserFriendData.age);
    data.should.have.property("gender", testUserFriendData.gender);
    data.should.have.property("fullName", testUserFriendData.fullName);
    data.should.have.property("aboutMe", testUserFriendData.aboutMe);
  });

  it("get all users", async () => {
    const response = await chai.request(constants.serviceUrl)
      .get(constants.userApi)
      .set("Authorization", `Bearer ${userSession.token}`);
    logger.info(`response is ${JSON.stringify(response)}`);
    const data = JSON.parse(response.text).rows;
    logger.info(`data is ${JSON.stringify(data)}`);
    // testUser, testFriendUser and AdminUser
    data.should.have.property("length", 3);
  });
});

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

describe("E2E user flow", async () => {
  describe("Test User Creation, Auth, Deletion", async () => {
    it("add single user", async () => {
      const response = await chai.request(constants.serviceUrl)
        .post(constants.userApi)
        .send(testUserData);
      logger.info(`response is ${JSON.stringify(response)}`);
      response.should.have.status(201, `create user resp is ${JSON.stringify(response.error)}`);

      const data = JSON.parse(response.text);
      logger.info(`data is ${JSON.stringify(data)}`);
      data.should.have.property("id");
      userSession.userId = data.id;
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
      response.should.have.status(200, `login user resp is ${JSON.stringify(response.error)}`);

      logger.info(`auth response is ${JSON.stringify(response)}`);
      const data = JSON.parse(response.text);
      data.should.have.property("auth", true);
      data.should.have.property("token");
      userSession.token = data.token;
    });

    it("add user (for friend creation)", async () => {
      const response = await chai.request(constants.serviceUrl)
        .post(constants.userApi)
        .send(testUserFriendData);
      response.should.have.status(201, `add friend user resp is ${JSON.stringify(response.error)}`);
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

      const authResponse = await chai.request(constants.serviceUrl)
        .post(constants.authApi)
        .send(
          {
            email: testUserFriendData.email,
            password: testUserFriendData.password,
          },
        );
      authResponse.should.have.status(200, `login user resp is ${JSON.stringify(authResponse.error)}`);

      logger.info(`auth response is ${JSON.stringify(authResponse)}`);
      const authData = JSON.parse(authResponse.text);
      authData.should.have.property("auth", true);
      authData.should.have.property("token");
      testSessionData.friendToken = authData.token;
    });

    it("get all users", async () => {
      const response = await chai.request(constants.serviceUrl)
        .get(constants.userApi)
        .set("Authorization", `Bearer ${userSession.token}`);
      response.should.have.status(200, `get all  users resp is ${JSON.stringify(response.error)}`);

      logger.info(`response is ${JSON.stringify(response)}`);
      const data = JSON.parse(response.text).rows;
      logger.info(`data is ${JSON.stringify(data)}`);
      // testUser, testFriendUser and AdminUser
      data.should.have.property("length", 3);
    });
  });

  describe("Test Friends", async () => {
    it("User1 follows Friend1", async () => {
      const payload = {
        fromUserId: userSession.userId,
        toUserId: testSessionData.friendId,
      };
      const response = await chai.request(constants.serviceUrl)
        .post(`${constants.friendsApi}/follow`)
        .send(payload);
      response.should.have.status(200, `create Friends ${JSON.stringify(response.error)}`);
    });

    it("get all User1 is following", async () => {
      const response = await chai.request(constants.serviceUrl)
        .get(`${constants.friendsApi}/follower/${userSession.userId}`);
      response.should.have.status(200, `get Friends ${JSON.stringify(response.error)}`);
      const respBody = JSON.parse(response.text);
      const { data } = respBody;
      data[0].should.have.property("userid", testSessionData.friendId);

      logger.info(`User1 is following ${JSON.stringify(data)}`);
    });
  });

  describe("Test Delete User ", async () => {
    it("Deleting User from wrong token should fail", async () => {
      const response = await chai.request(constants.serviceUrl)
        .delete(`${constants.userApi}/${testSessionData.friendId}`)
        .set("Authorization", `Bearer ${userSession.token}`);
      logger.info(`response is ${JSON.stringify(response)}`);
      response.should.have.status(403, `delete user resp is ${JSON.stringify(response.error)}`);
    });

    it("Deleting User", async () => {
      const response = await chai.request(constants.serviceUrl)
        .delete(`${constants.userApi}/${userSession.userId}`)
        .set("Authorization", `Bearer ${userSession.token}`);
      logger.info(`response is ${JSON.stringify(response)}`);
      response.should.have.status(200, `delete user resp is ${JSON.stringify(response.error)}`);
    });

    it("Deleting Friend User", async () => {
      const response = await chai.request(constants.serviceUrl)
        .delete(`${constants.userApi}/${testSessionData.friendId}`)
        .set("Authorization", `Bearer ${testSessionData.friendToken}`);
      logger.info(`response is ${JSON.stringify(response)}`);
      response.should.have.status(200, `delete user resp is ${JSON.stringify(response.error)}`);
    });
  });
});

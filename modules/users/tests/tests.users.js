/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const { buildapp } = require("../../../app");

const should = chai.should();
const { User, syncModels } = require("../models/user");

chai.use(chaiHttp);
let app;
const session = {};
before(async () => {
  app = await buildapp();
  await syncModels();
  await createUser({
    email: "test99@gmail.com",
    username: "adminUser",
    age: 22,
    gender: "F",
    password: "abcd1234",
    role: "Admin",
  });
  const authRes = await authenticateUser("test99@gmail.com", "abcd1234");
  session.token = authRes.token;
});

after(async () => {
  await app.close();
});

async function createUser(userData) {
  await User.create({
    ...userData,
  });
}
async function authenticateUser(email, password) {
  const res = await app.inject({
    method: "POST",
    url: "/authenticate",
    payload: {
      email,
      password,
    },
  });
  console.log(`authenticate res is ${JSON.stringify(res.payload)}`);
  res.should.have.status(200);
  return JSON.parse(res.payload);
}
async function destroyUser() {
  await User.destroy({
    where: {},
    truncate: true,
  });
}

async function destroyData() {
  await destroyUser();
}

describe("test user apis", () => {
  beforeEach("emptyDB before each", async () => {
    await destroyData();
  });

  describe("T1 test get user api", async () => {
    beforeEach("add user to db for test", async () => {
      await createUser({
        email: "test0@gmail.com",
        username: "test0user",
        age: 22,
        gender: "F",
        password: "abcd1234",
      });
    });

    afterEach("clear user data", async () => {
      await destroyUser();
    });

    it("T1a test get all users ", async () => {
      const response = await app.inject(
        {
          method: "GET",
          url: "/users",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      const data = JSON.parse(response.body);
      console.log(`T1a Get users data is ${JSON.stringify(data)}`);

      data.should.have.property("count", 1);
      data.rows[0].should.have.property("email", "test0@gmail.com");
      data.rows[0].should.have.property("username", "test0user");
      data.rows[0].should.have.property("age", 22);
      data.rows[0].should.have.property("gender", "F");
    });

    it("T1b test get single user by id ", async () => {
      const allUserResp = await app.inject(
        {
          method: "GET",
          url: "/users",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      const allUserData = JSON.parse(allUserResp.body);
      console.log(`T1b Get users data is  ${JSON.stringify(allUserData)}`);
      const userId = allUserData.rows[0].id;
      const response = await app.inject(
        {
          method: "GET",
          url: `/users/${userId}`,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      response.should.have.status(200, `error is ${JSON.stringify(response.error)}`);
      const data = JSON.parse(response.body);
      console.log(`T1b single user data is ${JSON.stringify(data)}`);

      data.should.have.property("id", userId);
      data.should.have.property("email", "test0@gmail.com");
      data.should.have.property("username", "test0user");
      data.should.have.property("age", 22);
      data.should.have.property("gender", "F");
    });
  });

  describe("T2 test post user api", async () => {
    it("T2a test add user ", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/users",
        payload: {
          email: "test1@gmail.com",
          username: "test1user",
          age: 23,
          gender: "M",
          password: "abcd1234",
        },
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      });
      res.should.have.status(201);
      console.log(`T2a res is ${JSON.stringify(res.payload)}`);
      const response = await app.inject(
        {
          method: "GET",
          url: "/users",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      const data = JSON.parse(response.body);
      console.log(`T2a user data is ${JSON.stringify(data)}`);

      data.should.have.property("count", 1);
      data.rows[0].should.have.property("email", "test1@gmail.com");
      data.rows[0].should.have.property("username", "test1user");
      data.rows[0].should.have.property("age", 23);
      data.rows[0].should.have.property("gender", "M");
    });
  });

  describe("T3 test update user api", async () => {
    beforeEach("add user to db for test", async () => {
      await createUser({
        email: "test0@gmail.com",
        username: "test0user",
        age: 22,
        gender: "F",
        password: "abcd1234",
      });
    });

    afterEach("clear user data", async () => {
      await destroyUser();
    });
    it("T3a test update user ", async () => {
      const response = await app.inject(
        {
          method: "GET",
          url: "/users",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      const userData = JSON.parse(response.body);
      console.log(`T3a update user data is ${JSON.stringify(userData)}`);
      const userId = userData.rows[0].id;

      const res = await app.inject({
        method: "PUT",
        url: `/users/${userId}`,
        payload: {
          email: "test1@gmail.com",
          username: "test1user",
          age: 23,
        },
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      });
      res.should.have.status(200, `res is ${JSON.stringify(res.error)}`);
      const putResp = res.payload;
      console.log(`T3a update res is ${JSON.stringify(putResp)}`);
      const updatedUserResp = await app.inject(
        {
          method: "GET",
          url: `/users/${userId}`,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      console.log(`T3a update resp user data is ${updatedUserResp.body}`);

      const updatedUserData = JSON.parse(updatedUserResp.body);

      updatedUserData.should.have.property("email", "test1@gmail.com");
      updatedUserData.should.have.property("username", "test1user");
      updatedUserData.should.have.property("age", 23);
    });
  });

  describe("T4 test patch user api", async () => {
    beforeEach("add user to db for test", async () => {
      await createUser({
        email: "test0@gmail.com",
        username: "test0user",
        age: 22,
        gender: "F",
        password: "abcd1234",
      });
    });

    afterEach("clear user data", async () => {
      await destroyUser();
    });
    it("T4a test PATCH user ", async () => {
      const response = await app.inject(
        {
          method: "GET",
          url: "/users",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      const userData = JSON.parse(response.body);
      console.log(`patch get user data is ${JSON.stringify(userData)}`);
      const userId = userData.rows[0].id;

      const res = await app.inject({
        method: "PATCH",
        url: `/users/${userId}`,
        payload: {
          email: "test1@gmail.com",
          username: "test1user",
        },
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      });
      res.should.have.status(200, `patch resp is ${JSON.stringify(res.error)}`);
      const putResp = res.payload;
      console.log(`patch resp is ${JSON.stringify(putResp)}`);

      const updatedUserResp = await app.inject(
        {
          method: "GET",
          url: `/users/${userId}`,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      const updatedUserData = JSON.parse(updatedUserResp.body);
      console.log(`update resp user data is ${JSON.stringify(updatedUserData)}`);

      updatedUserData.should.have.property("email", "test1@gmail.com");
      updatedUserData.should.have.property("username", "test1user");
      updatedUserData.should.have.property("age", 22);
      updatedUserData.should.have.property("gender", "F");
    });
  });

  describe("T5 test delete user api", async () => {
    beforeEach("add user to db for test", async () => {
      await createUser({
        email: "test0@gmail.com",
        username: "test0user",
        age: 22,
        gender: "F",
        password: "abcd1234",
      });
    });

    afterEach("clear user data", async () => {
      await destroyUser();
    });
    it("T5a test get single user by id ", async () => {
      const allUserResp = await app.inject(
        {
          method: "GET",
          url: "/users",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      const allUserData = JSON.parse(allUserResp.body);
      const userId = allUserData.rows[0].id;
      const response = await app.inject(
        {
          method: "DELETE",
          url: `/users/${userId}`,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      response.should.have.status(200, `DELETE resp is ${JSON.stringify(response.error)}`);
      const data = JSON.parse(response.body);
      console.log(`delete resp is ${data}`);
      const userResp = await app.inject(
        {
          method: "GET",
          url: `/users/${userId}`,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        },
      );
      userResp.should.have.status(404, `DELETE resp is ${JSON.stringify(userResp.error)}`);
    });
  });
});

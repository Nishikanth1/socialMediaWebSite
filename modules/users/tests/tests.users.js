/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const { buildapp } = require("../../../app");

const should = chai.should();
const { User, syncModels } = require("../models/user");

chai.use(chaiHttp);
let app;
before(async () => {
  app = await buildapp();
  await syncModels();
});

after(async () => {
  await app.close();
});
async function createUser(userData) {
  await User.create({
    ...userData,
  });
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

  describe("test get user api", async () => {
    beforeEach("add user to db for test", async () => {
      await createUser({
        email: "test0@gmail.com",
        username: "test0user",
        age: 22,
        gender: "F",
      });
    });

    afterEach("clear user data", async () => {
      await destroyUser();
    });

    it("test get all users ", async () => {
      const response = await app.inject(
        {
          method: "GET",
          url: "/users",
        },
      );
      const data = JSON.parse(response.body);
      console.log(`user data is ${JSON.stringify(data)}`);

      data.should.have.property("count", 1);
      data.rows[0].should.have.property("email", "test0@gmail.com");
      data.rows[0].should.have.property("username", "test0user");
      data.rows[0].should.have.property("age", 22);
      data.rows[0].should.have.property("gender", "F");
    });

    it("test get single user by id ", async () => {
      const allUserResp = await app.inject(
        {
          method: "GET",
          url: "/users",
        },
      );
      const allUserData = JSON.parse(allUserResp.body);
      console.log(`allUserData in get single user data is ${JSON.stringify(allUserData)}`);
      const userId = allUserData.rows[0].id;
      const response = await app.inject(
        {
          method: "GET",
          url: `/user/${userId}`,
        },
      );
      const data = JSON.parse(response.body);
      console.log(`single user data is ${JSON.stringify(data)}`);

      data.should.have.property("id", userId);
      data.should.have.property("email", "test0@gmail.com");
      data.should.have.property("username", "test0user");
      data.should.have.property("age", 22);
      data.should.have.property("gender", "F");
    });
  });

  describe("test post user api", async () => {
    it("test add user ", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/user",
        payload: {
          email: "test1@gmail.com",
          username: "test1user",
          age: 23,
          gender: "M",
        },
      });
      res.should.have.status(201);
      console.log(`res is ${JSON.stringify(res.payload)}`);
      const response = await app.inject(
        {
          method: "GET",
          url: "/users",
        },
      );
      const data = JSON.parse(response.body);
      console.log(`user data is ${JSON.stringify(data)}`);

      data.should.have.property("count", 1);
      data.rows[0].should.have.property("email", "test1@gmail.com");
      data.rows[0].should.have.property("username", "test1user");
      data.rows[0].should.have.property("age", 23);
      data.rows[0].should.have.property("gender", "M");
    });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const nock = require("nock");
const { buildapp } = require("../../../app");

const should = chai.should();
const { expect } = chai;
const { Post, syncModels } = require("../models/post");

chai.use(chaiHttp);
let app;
const session = {};

before(async () => {
  app = await buildapp();
  await syncModels();
});

after(async () => {
  await app.close();
});

async function destroyPosts() {
  await Post.destroy({
    where: {},
    truncate: true,
  });
}
async function destroyData() {
  await destroyPosts();
}
describe("test site post apis", () => {
  beforeEach("emptyDB before each", async () => {
    await destroyData();
  });

  describe("T1 test add post  api", async () => {
    afterEach("clear post data", async () => {
      await destroyData();
    });

    it("T1a add post", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/posts",
        payload: {
          title: "First Title",
          content: "Test Content1, Test Content2, Test Content3",
          userId: 23,
        },
      });
      res.should.have.status(201);
      console.log(`T1a res is ${JSON.stringify(res.payload)}`);
      const postId = JSON.parse(res.body).id;
      const response = await app.inject(
        {
          method: "GET",
          url: `/posts/${postId}`,
        },
      );
      response.should.have.status(200);
      const data = JSON.parse(response.body);
      console.log(`T2a post get data is ${JSON.stringify(data)}`);
      data.should.have.property("id", postId);
      data.should.have.property("title", "First Title");
    });
  });
  describe("T2 test delete post api", async () => {
    it("T2a delete non existing post", async () => {
      const response = await app.inject(
        {
          method: "delete",
          url: "/posts/12323",
        },
      );
      response.should.have.status(404);
    });

    it("T2b delete null post id", async () => {
      const response = await app.inject(
        {
          method: "delete",
          url: "/posts/",
        },
      );
      response.should.have.status(400);
    });

    it("T2c delete post", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/posts",
        payload: {
          title: "Second Title",
          content: "Test Content1, Test Content2, Test Content3",
          userId: 25,
        },
      });
      const postId = JSON.parse(res.body).id;

      const response = await app.inject(
        {
          method: "delete",
          url: `/posts/${postId}`,
        },
      );
      response.should.have.status(200);
      const getRes1 = await app.inject(
        {
          method: "GET",
          url: `/posts/${postId}`,
        },
      );
      getRes1.should.have.status(404);
    });
  });

  describe("T3 test get all post of user api", async () => {
    it("T3a get posts of users with no posts", async () => {
      const response = await app.inject(
        {
          method: "GET",
          url: "/users/posts/12323",
        },
      );
      response.should.have.status(200);
      const data = JSON.parse(response.body);

      data.should.have.property("count", 0);
      data.rows.should.be.empty;
    });

    it("T3a get posts of users with no posts", async () => {
      const res1 = await app.inject({
        method: "POST",
        url: "/posts",
        payload: {
          title: "Third Title",
          content: "Test Content1, Test Content2, Test Content3",
          userId: 25,
        },
      });
      const postIdList = [];
      postIdList.push(JSON.parse(res1.body).id);

      const res2 = await app.inject({
        method: "POST",
        url: "/posts",
        payload: {
          title: "Fourth Title",
          content: "Test Content1, Test Content2, Test Content3",
          userId: 25,
        },
      });
      postIdList.push(JSON.parse(res2.body).id);

      const res3 = await app.inject({
        method: "POST",
        url: "/posts",
        payload: {
          title: "Fifth Title",
          content: "Test Content1, Test Content2, Test Content3",
          userId: 30,
        },
      });

      const response = await app.inject(
        {
          method: "GET",
          url: "/users/posts/25",
        },
      );
      response.should.have.status(200);
      const data = JSON.parse(response.body);

      data.should.have.property("count", 2);
      const actualIds = data.rows.map((post) => post.id);
      expect(actualIds.sort()).deep.to.equal(postIdList.sort());
    });
  });
});

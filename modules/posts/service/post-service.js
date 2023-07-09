const { Post } = require("../models/post");

async function getPost(request, response, logger) {
  try {
    const postId = request.params.id;
    const data = await Post.findByPk(postId);
    logger.info(`get post data is ${JSON.stringify(data)}`);
    if (!data) {
      return response.status(404).send("Post Not found");
    }
    return response.status(200).send(data);
  } catch (error) {
    logger.error(error);
    return response.status(504).send({
      message:
          error.message || "Some error occurred while reading the post object.",
    });
  }
}

async function getUserPosts(request, response, logger) {
  try {
    const { userId } = request.params;
    const where = { userId };
    const data = await Post.findAndCountAll({ where });
    return response.status(200).send(data);
  } catch (error) {
    logger.error(error);
    return response.status(504).send({
      message:
            error.message || "Some error occurred while getting the user posts object.",
    });
  }
}

async function createPost(request, response, logger) {
  if (!request.body.title) {
    return response.status(400).send({
      message: "Post needs a title",
    });
  }
  logger.info(`create post body is ${JSON.stringify(request.body)}`);
  // Create an user
  const postData = {
    title: request.body.title,
    content: request.body.content,
    userId: request.body.userId,
  };

  try {
    const data = await Post.create(postData);
    logger.info(`data from create post is ${JSON.stringify(data)}`);
    return response.status(201).send(data);
  } catch (error) {
    logger.error(error);
    return response.status(500).send({
      message:
          error.message || "Some error occurred while creating the post object.",
    });
  }
}

async function deletePost(request, response, logger) {
  const postId = request.params.id;
  if (!postId) {
    return response.status(400).send({ message: `Invalid postId id ${postId}` });
  }
  try {
    const where = { id: postId };
    const existingPost = await Post.findOne({ where });
    if (!existingPost) {
      return response.status(404).send({ message: `Post ${postId} not exists` });
    }
    const data = await Post.destroy({ where });
    return response.status(200).send({ message: `Post ${postId} deleted successfully`, data });
  } catch (error) {
    logger.error(error);
    return response.status(504).send({
      message:
        error.message || `Some error occurred while deleting the post object wiith id ${postId}.`,
    });
  }
}

async function patchPost(request, response, logger) {
  try {
    const postId = request.params.id;
    const postObject = {
      title: request.body.title,
      content: request.body.content,
      userId: request.body.userId,
    };
    logger.info(`patch post body is ${JSON.stringify(postObject)}`);
    const existingPost = await Post.findByPk(postId);
    if (!existingPost) {
      return response.status(404).send({ message: `User ${postId} not exists` });
    }
    const updatedUserData = _.merge({}, existingPost, postObject);
    const [updatedRowCount, updatedPosts] = await Post.update(updatedUserData, {
      where: { id: postId },
      returning: true,
    });

    logger.info(`Patched post ${postId} response is ${JSON.stringify(updatedPosts)}`);
    return response.status(200).send({ isUpdated: true, data: updatedPosts });
  } catch (error) {
    logger.error(error);
    return response.status(500).send({
      message:
      error.message || "Some error occurred while updating the post object.",
    });
  }
}

async function updatePost(request, response, logger) {
  try {
    const PostId = request.params.id;
    const where = { id: PostId };
    const existingPost = await Post.findOne({ where });
    if (!existingPost) {
      return response.status(404).send({ message: `Post ${PostId} not exists` });
    }
    const PostObject = {
      title: request.body.title,
      content: request.body.content,
      userId: request.body.userId,
    };
    logger.info(`udpate Post body is ${JSON.stringify(PostObject)}`);
    const data = await Post.update(PostObject, { where });
    logger.info(`Update Post ${PostId} response is ${JSON.stringify(data)}`);
    return response.status(200).send({ isUpdated: true });
  } catch (error) {
    logger.error(error);
    return response.status(500).send({
      message:
      error.message || "Some error occurred while updating the Post object.",
    });
  }
}
module.exports = {
  getPost,
  createPost,
  deletePost,
  getUserPosts,
  patchPost,
  updatePost,
};

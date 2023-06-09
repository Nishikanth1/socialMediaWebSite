const jwt = require("jsonwebtoken");
const { Post } = require("../posts/models/post");

const SECRET = process.env.JWT_SECRET;

async function checkUserHasPermission(request, actorUserId) {
  const resourceUserId = request.params.id;
  if (parseInt(resourceUserId, 10) === parseInt(actorUserId, 10)) {
    return true;
  }
  if (request.method === "GET") {
    return true;
  }
  return false;
}

async function checkRoleIsAllowed(actualRoles, allowedRoles) {
  let hasAllowedRole = actualRoles.some((role) => allowedRoles.includes(role));
  // Admin can do any operation
  hasAllowedRole ||= actualRoles.includes("Admin");
  return hasAllowedRole;
}

async function checkUserPostPermission(request, actorUserId) {
  const postId = request.params.id;
  if (!postId) {
    return true;
  }
  const postData = await Post.findByPk(postId);
  if (!postData) {
    return true;
  }
  const postOwnerUser = postData.userId;
  if (parseInt(postOwnerUser, 10) === parseInt(actorUserId, 10)) {
    return true;
  }
  if (request.method === "GET") {
    return true;
  }
  return false;
}

function checkUserIsLogged() {
  // eslint-disable-next-line consistent-return
  return async (request, response, next) => {
    try {
      // Bearer xyz
      const jwtToken = request.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(jwtToken, SECRET);
      const { email, roles, id } = decodedToken;
      console.log(`checkUserIsLogged decodedToken is ${JSON.stringify(decodedToken)}`);
      if (!id) {
        return response.status(401).send("Invalid Token, Please login");
      }
    } catch (error) {
      request.log.error(`Invalid Token ${error}, Please login`);
      // eslint-disable-next-line consistent-return
      return response.status(401).send("Invalid Token, Please login");
    }
  };
}

function checkPermissions(allowedRoles) {
  // eslint-disable-next-line consistent-return
  return async (request, response, next) => {
    try {
      const api = request.url;
      // Bearer xyz
      const jwtToken = request.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(jwtToken, SECRET);
      const { email, roles, id } = decodedToken;
      console.log(`decodedToken is ${JSON.stringify(decodedToken)}`);
      const actorUserId = id;
      let hasPermissions = false;
      const isRoleAllowed = await checkRoleIsAllowed(roles, allowedRoles);

      if (api.includes("/users")) {
        hasPermissions = await checkUserHasPermission(request, actorUserId);
      }

      if (api.includes("/posts")) {
        hasPermissions = await checkUserPostPermission(request, actorUserId);
      }

      hasPermissions &&= isRoleAllowed;
      hasPermissions ||= roles.includes("Admin");

      if (hasPermissions) {
        request.log.info(`${email} has permissions for api ${api}`);
        return;
      }
      // eslint-disable-next-line consistent-return
      return response.status(403).send("User Unauthorized, Make sure your role/user is correct");
    } catch (error) {
      request.log.error(`Invalid Token ${error}`);
      // eslint-disable-next-line consistent-return
      return response.status(401).send("Invalid Token");
    }
  };
}

module.exports = { checkPermissions, checkUserIsLogged };

const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

async function checkUserHasPermission(request, actorUserId) {
  const resourceUserId = request.params.id;
  if (resourceUserId === actorUserId) {
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

function checkPermissions(allowedRoles) {
  // eslint-disable-next-line consistent-return
  return async (request, response, next) => {
    try {
      const api = request.url;
      // Bearer xyz
      const jwtToken = request.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(jwtToken, SECRET);
      const { email, roles, id } = decodedToken;
      const actorUserId = id;
      let hasPermissions = false;
      const isRoleAllowed = await checkRoleIsAllowed(roles, allowedRoles);

      if (api.includes("/users")) {
        hasPermissions = await checkUserHasPermission(request, actorUserId);
      }
      hasPermissions &&= isRoleAllowed;
      hasPermissions ||= roles.includes("Admin");

      if (hasPermissions) {
        request.log.info(`${email} has permissions for api ${api}`);
        return null;
      }
      return response.status(403).send("User Unauthorized, Make sure your role is correct");
    } catch (error) {
      request.log.error(`Invalid Token ${error}`);
      return response.status(401).send("Invalid Token");
    }
  };
}

module.exports = { checkPermissions };

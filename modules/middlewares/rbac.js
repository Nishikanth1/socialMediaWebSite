const { jwt } = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

async function checkRoleIsAllowed(allowedRoles) {
  return async (request, response, next) => {
    try {
    // Bearer xyz
      const jwtToken = request.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(jwtToken, SECRET);
      const { email, roles } = decodedToken;

      let hasAllowedRole = roles.some((role) => allowedRoles.includes(role));
      hasAllowedRole ||= roles.includes("Admin");
      if (hasAllowedRole) {
        next();
      } else {
        response.status(403).send("User Unauthorized, Make sure your role is correct");
      }
    } catch (error) {
      response.status(401).send("Invalid Token");
    }
  };
}

module.exports = { checkRoleIsAllowed };

const roles = {
  Admin: "Admin",
  User: "User",
};
const permissions = {
  Admin: ["All"],
  User: ["ReadAll", "WriteOwn"],
};

module.exports = {
  roles,
};

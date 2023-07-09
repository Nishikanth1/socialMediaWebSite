function getLimitOffset(request) {
  const { limit, offset } = request.params;
  const options = {
    limit: limit || 10,
    offset: offset || 0,
  };
  return options;
}

module.exports = {
  getLimitOffset,
};

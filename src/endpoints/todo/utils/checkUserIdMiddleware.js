/** @type {import('express').Handler} */
const checkUserIdMiddleware = (req, res, next) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');

  if (parseInt(userId)) {
    req.userId = +userId;
  } else {
    req.userId = 0;
  }

  next();
};

module.exports = { checkUserIdMiddleware };

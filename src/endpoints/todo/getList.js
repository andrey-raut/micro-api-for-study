const db = require('../../db');

/**
 * @typedef {object} QueryParams
 * @property {string | undefined} page
 * @property {string | undefined} perPage
 * @property {'true' | 'false' | undefined} isCompleted
 */

/**
 * @type {import('express').RequestHandler<unknown, unknown, unknown, QueryParams>}
 */
const getList = async (req, res) => {
  const page = parseInt(req.query.page) ? +req.query.page : 1;
  const perPage = parseInt(req.query.perPage) ? +req.query.perPage : 10;

  const {
    todoList,
    totalItemsCount,
    activeItemsCount,
    completedItemsCount,
    page: actualPage,
    totalPages,
  } = await db.todo.getList({
    userId: req.userId,
    page,
    perPage,
    isCompleted: req.query.isCompleted !== undefined ? req.query.isCompleted === 'true' : undefined,
  });

  res.json({
    payload: todoList,
    meta: {
      page: actualPage,
      perPage,
      totalPages,
      totalItemsCount,
      activeItemsCount,
      completedItemsCount,
    },
  });
};

module.exports = { getList };

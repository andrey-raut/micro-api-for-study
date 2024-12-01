const db = require('../../db');

/**
 * @type {import('express').RequestHandler}
 */
const toggleStatuses = async (req, res) => {
  const { todoList, activeItemsCount } = await db.todo.getList({ userId: req.userId });

  const targetStatus = activeItemsCount > 0;

  await db.todo.updateMany(todoList.map(({ id }) => ({
    id,
    isCompleted: targetStatus
  })));

  res.sendStatus(200);
};

module.exports = { toggleStatuses };

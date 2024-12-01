const db = require('../../db');

/**
 * @type {import('express').RequestHandler}
 */
const clearCompleted = async (req, res) => {
  const { todoList: completedItems } = await db.todo.getList({
    userId: req.userId,
    isCompleted: true,
  });

  await db.todo.deleteMany(completedItems.map(({ id }) => id));

  res.sendStatus(204);
};

module.exports = { clearCompleted };

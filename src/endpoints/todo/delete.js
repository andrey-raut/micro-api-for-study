const db = require('../../db');

/**
 * @typedef {object} Params
 * @property {string} todoId
 */

/**
 * @type {import('express').RequestHandler<Params>}
 */
const deleteTodo = async (req, res) => {
  const existingTodo = await db.todo.getById({
    id: req.params.todoId,
    userId: req.userId,
  });

  if (!existingTodo) {
    res.status(404).json({
      message: 'Todo not found',
    });
    return
  }

  await db.todo.delete(req.params.todoId);

  res.sendStatus(204);
};

module.exports = { deleteTodo };

const db = require('../../db');
const { formatTodoText } = require('./utils/formatTodoText');

/**
 * @typedef {object} Params
 * @property {string} todoId
 */

/**
 * @typedef {object} Body
 * @property {string} text
 * @property {boolean | undefined} isCompleted
 */

/**
 * @type {import('express').RequestHandler<Params, unknown, Body>}
 */
const updateTodo = async (req, res) => {
  const data = {};

  if (req.body.text) {
    const text = formatTodoText(req.body.text);

    if (!text) {
      res.status(400).json({
        message: 'Text is required',
      });
      return;
    }

    data.text = text;
  }
  if (typeof req.body.isCompleted === 'boolean') {
    data.isCompleted = req.body.isCompleted;
  }

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

  const updatedTodo = await db.todo.update(req.params.todoId, data);

  res.status(201).json({ payload: updatedTodo });
};

module.exports = { updateTodo };

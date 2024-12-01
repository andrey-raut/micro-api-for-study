const db = require('../../db');
const { formatTodoText } = require('./utils/formatTodoText');

/**
 * @typedef {object} Body
 * @property {string} text
 * @property {boolean | undefined} isCompleted
 */

/**
 * @type {import('express').RequestHandler<unknown, unknown, Body>}
 */
const createTodo = async (req, res) => {
  const text = formatTodoText(req.body.text || '');

  if (!text) {
    res.status(400).json({
      message: 'Text is required',
    });
    return;
  }

  const newTodo = await db.todo.create({
    userId: req.userId,
    text: req.body.text,
    isCompleted: req.body.isCompleted ?? false,
  });

  res.status(201).json({ payload: newTodo });
};

module.exports = { createTodo };

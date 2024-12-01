const express = require('express');
const { checkUserIdMiddleware } = require('./utils/checkUserIdMiddleware');
const { getList } = require('./getList');
const { createTodo } = require('./create');
const { updateTodo } = require('./update');
const { deleteTodo } = require('./delete');
const { clearCompleted } = require('./clearCompleted');
const { toggleStatuses } = require('./toggleStatuses');

const router = express.Router();

router.use(checkUserIdMiddleware);

router.get('/todo', getList);
router.post('/todo', createTodo);
router.post('/todo/toggle-statuses', toggleStatuses);
router.patch('/todo/:todoId', updateTodo);
router.delete('/todo/all-completed', clearCompleted);
router.delete('/todo/:todoId', deleteTodo);

module.exports = { todoEndpoints: router };

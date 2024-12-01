const fs = require('fs/promises');
const crypto = require('crypto');

/**
 * @typedef {{
*    id: string;
*    text: string;
*    isCompleted: boolean;
*    userId: number;
* }} TodoItem
*/

const filePath = `${__dirname}/data/db_todo-item.json`;
/** @returns {Promise<TodoItem[]>} */
const getFullTodoList = async () => {
  const rawData = await fs.readFile(filePath, 'utf-8').catch(() => '[]');
  const parsed = JSON.parse(rawData);
  return parsed;
};

/** @param {TodoItem[]} */
const setFullTodoList = async (data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

/**
 * @typedef {object} GetListResult
 * @property {TodoItem[]} todoList
 * @property {number} totalItemsCount
 * @property {number} completedItemsCount
 * @property {number} activeItemsCount
 * @property {number} page
 * @property {number} totalPages
 */

/**
 * @param {object} params
 * @param {number} params.userId
 * @param {boolean | undefined} params.isCompleted
 * @param {number | undefined} params.page
 * @param {number | undefined} params.perPage
 *
 * @returns {Promise<GetListResult>}
 */
const getTodos = async (params) => {
  const fullList = await getFullTodoList();
  let todoList = fullList.filter((todo) => todo.userId === params.userId);
  const totalItemsCount = todoList.length;
  let completedItemsCount = 0;

  todoList = todoList.filter((todo) => {
    if (todo.isCompleted) {
      completedItemsCount++;
    }

    if (
      params.isCompleted !== undefined &&
      todo.isCompleted !== params.isCompleted
    ) {
      return false;
    }

    return true;
  })

  const totalPages = params.perPage ? Math.ceil(todoList.length / (params.perPage)) : 1;
  const actualPage = params.page ? Math.min(params.page, totalPages) : 1;

  if (params.page && params.perPage) {
    const offset = (actualPage - 1) * params.perPage;
    todoList = todoList.slice(offset, offset + params.perPage);
  }

  return {
    todoList,
    totalItemsCount,
    completedItemsCount,
    activeItemsCount: totalItemsCount - completedItemsCount,
    totalPages,
    page: actualPage,
  };
};

/**
 * @param {object} params
 * @param {string} params.id
 * @param {number} params.userId
 *
 * @returns {Promise<TodoItem | null>}
 */
const getTodoById = async (params) => {
  const fullList = await getFullTodoList();

  const todo = fullList.find((todo) => (
    todo.id === params.id &&
    todo.userId === params.userId
  ));

  return todo || null
};

/**
 * @param {object} data
 * @param {number} data.userId
 * @param {string} data.text
 * @param {boolean} data.isCompleted
 *
 * @returns {Promise<TodoItem>}
 */
const createTodo = async (data) => {
  const id = crypto.randomUUID();

  /** @type {TodoItem} */
  const newTodo = {
    ...data,
    id,
  };
  const fullList = await getFullTodoList();
  await setFullTodoList([...fullList, newTodo]);
  return newTodo
};

/**
 * @param {string} id
 * @param {object} data
 * @param {string} data.text
 * @param {boolean} data.isCompleted
 *
 * @returns {Promise<TodoItem>}
 */
const updateTodo = async (id, data) => {
  const fullList = await getFullTodoList();

  const todoIndex = fullList.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    throw new Error('Todo not found');
  }

  const updatedTodo = {
    ...fullList[todoIndex],
    ...data,
  };
  fullList[todoIndex] = updatedTodo;
  await setFullTodoList(fullList);

  return updatedTodo;
};

/**
 * @param {object[]} data
 * @param {string} data[].id
 * @param {string | undefined} data.text
 * @param {boolean | undefined} data.isCompleted
 */
const updateManyTodos = async (data) => {
  const fullList = await getFullTodoList();
  data.forEach(({ id, ...newData }) => {
    const todoIndex = fullList.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    fullList[todoIndex] = {
      ...fullList[todoIndex],
      ...newData,
    };
  })
  await setFullTodoList(fullList);
};

/** @param {string} id */
const deleteTodo = async (id) => {
  const fullList = await getFullTodoList();

  const todoIndex = fullList.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    throw new Error('Todo not found');
  }

  fullList.splice(todoIndex, 1);
  await setFullTodoList(fullList);
};

/** @param {string[]} ids */
const deleteManyTodos = async (ids) => {
  const fullList = await getFullTodoList();
  ids.forEach((id) => {
    const todoIndex = fullList.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    fullList.splice(todoIndex, 1);
  })
  await setFullTodoList(fullList);
};

module.exports = {
  getList: getTodos,
  getById: getTodoById,
  create: createTodo,
  update: updateTodo,
  updateMany: updateManyTodos,
  delete: deleteTodo,
  deleteMany: deleteManyTodos,
};

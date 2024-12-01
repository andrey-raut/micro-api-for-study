/**
 * @param {string} text
 */
const formatTodoText = (text) => {
  return text.replaceAll(/^\s+|\s+$|(?<=\s)\s+/g, '');
};

module.exports = { formatTodoText };

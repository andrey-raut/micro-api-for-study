# Апи для обучательных разностей

Сервер работает без посторонних зависимостей для упрощения запуска без особых знаний

## Как запустить

- Склонировать/скачать этот репозиторий
- [Установить Node](https://nodejs.org/en/download/package-manager), если ещё не стоит
- В корневой дирректории этого проекта открыть консоль и вызвать `npm install`
- Там же вызвать `npm start`
- Отправлять запросы по адресу `http://localhost:4000`
- Если нужно изменить порт, достаточно чуть изменить команду вызова, добавив нужный порт. Вместо `npm start` делаем `PORT=1234 npm start` (или любой другой вместо `1234`)

## API для приложения список задач (TODO)

- [Авторизация](#todo-authorization)
- [Список запросов](#todo-list-of-requests)
  - [Создание тудушки](#todo-create-request)
  - [Получение списка тудушек](#todo-get-list-request)
  - [Редактирование тудушки](#todo-update-request)
  - [Удаление тудушки](#todo-delete-request)
  - [Удаление завершённых тудушек](#todo-clear-completed-request)
  - [Переключение статусов тудушек](#todo-toggle-statuses-request)

### Авторизация <a name="todo-authorization"></a>

Не поддерживает полноценной авторизации, но позволяет менять пользователя через ID пользователя (целое число), передаваемом в headers в формате `Authorization: "Bearer USER_ID"`. Пользователей создавать не нужно, достаточно передать любое число.
Пример на **fetch**:

```js
fetch("http://localhost:4000/todo", {
  method: "GET",
  headers: { Authorization: "Bearer 952" },
});
```

### Список запросов <a name="todo-list-of-requests"></a>

#### Создание тудушки <a name="todo-create-request"></a>

Метод - **`POST`**

URL - **`http://localhost:4000/todo`**

Принимаемые в body данные:

- **`text`** - Текст тудушки. Обязательное поле
- **`isCompleted`** - Требуемое значение. Опциональное поле. Дефолтное значение - **false**

Возвращает созданную тудушку.

```js
fetch("http://localhost:4000/todo", {
  method: "POST",
  headers: { Authorization: "Bearer 952" },
  body: JSON.stringify({
    text: "Buy some bread",
    isCompleted: false,
  }),
});
```

---

#### Получение списка тудушек <a name="todo-get-list-request"></a>

Метод - **`GET`**

URL - **`http://localhost:4000/todo`**

Поддерживаемые квери параметры:

- **`page`** - Текущая страница для пагинации. Опциональное поле. Дефолтное значение - **1**
- **`perPage`** - Количество элементов на страницу при пагинации. Опциональное поле. Дефолтное значение - **10**
- **`isCompleted`** - Вернёт только задачи с переданным значением **isCompleted**. Опциональное поле. Дефолтного значения нет. Если не прислать - вернёт с любым статусом

Возвращает пагинированный и отфильтрованный список тудушек, а так же все требуемые подсчёты.

Пример:

```js
fetch("http://localhost:4000/todo?page=1&perPage=15&isCompleted=false", {
  method: "GET",
  headers: { Authorization: "Bearer 952" },
});
```

---

#### Редактирование тудушки <a name="todo-update-request"></a>

Метод - **`PATCH`**

URL - **`http://localhost:4000/todo/:todoId`**

Принимаемые в body данные:

- **`text`** - Текст тудушки. Опциональное поле.
- **`isCompleted`** - Требуемое значение. Опциональное поле.

Возвращает отредактированную тудушку.

```js
fetch("http://localhost:4000/todo/2cee1f95-e19d-460c-a1c5-8067ad984b4b", {
  method: "PATCH",
  headers: { Authorization: "Bearer 952" },
  body: JSON.stringify({
    text: "Buy some milk",
    isCompleted: true,
  }),
});
```

---

#### Удаление тудушки <a name="todo-delete-request"></a>

Метод - **`DELETE`**

URL - **`http://localhost:4000/todo/:todoId`**

Ничего не возвращает.

```js
fetch("http://localhost:4000/todo/2cee1f95-e19d-460c-a1c5-8067ad984b4b", {
  method: "DELETE",
  headers: { Authorization: "Bearer 952" },
});
```

---

#### Удаление завершённых тудушек <a name="todo-clear-completed-request"></a>

Метод - **`DELETE`**

URL - **`http://localhost:4000/todo/all-completed`**

Удаляет все тудушки со статусом `isCompleted: true`
Ничего не возвращает.

```js
fetch("http://localhost:4000/todo/all-completed", {
  method: "DELETE",
  headers: { Authorization: "Bearer 952" },
});
```

---

#### Переключение статусов тудушек <a name="todo-toggle-statuses-request"></a>

Метод - **`POST`**

URL - **`http://localhost:4000/todo/toggle-statuses`**

Меняет статус тудушкам следующим образом

- Если есть хоть одна не завершённая тудушка - пометит все выполненными
- Если завершёны - пометит все активными
  Ничего не возвращает.

```js
fetch("http://localhost:4000/todo/toggle-statuses", {
  method: "POST",
  headers: { Authorization: "Bearer 952" },
});
```

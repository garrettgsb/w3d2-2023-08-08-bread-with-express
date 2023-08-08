/*
CRUD

Create
Read
Update
Delete

BREAD

Browse
Read
Edit
Add
Delete

REST - REpresentational State Transfer
RESTful routing

Resource: Todos
  Browse   GET /todos
  Read     GET /todos/:id
  Edit     POST /todos/:id
  Add      POST /todos
  Delete   POST /todos/:id/delete

Resource: Users
  Browse   GET /users
  Read     GET /users/:id
  Edit     POST /users/:id
  Add      POST /users
  Delete   POST /users/:id/delete

Resource: Songs
  Browse   GET /songs
  Read     GET /songs/:id
  Edit     POST /songs/:id
  Add      POST /songs
  Delete   POST /songs/:id/delete

GET and POST:
  GET - Ask the server to tell me something
  POST - Ask the server to change something

  PUT, PATCH, DELETE, etc.
*/

const todos = [
  "Get milk",
  "Wash car",
  "Walk dog",
];

function addTodo(todo) {
  todos.push(todo);
}

function removeTodo(idx) {
  if (!todos[idx]) throw new Error(`No todo at index ${idx}!`);
  todos.splice(idx, 1);
}

function updateTodo(idx, newText) {
  if (!todos[idx]) throw new Error(`No todo at index ${idx}!`);
  todos[idx] = newText;
}

function viewTodos() {
  return `
  <h1>Todos:</h1>
  <ul>
  ${todos.map((todo, idx) => `
    <li>
      ${todo} [${idx}]
      <form method='POST' action='/todos/${idx}/delete'>
        <button>🚮</button>
      </form>
      <form method='POST' action='/todos/${idx}'>
        <input name='newTodoText' placeholder='${todo}'>
        <button>🖋</button>
      </form>
    </li>
  `).join('\n')}
  </ul>
  <form method='POST' action='/todos'>
    <input name='newTodoText' placeholder='New todo text...'>
    <button>➕</button>
  </form>
  `;
}

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => response.redirect('/todos'));

/* Browse */
app.get('/todos', (request, response) => { response.send(viewTodos()) });

/* Edit */
app.post('/todos/:id', (request, response) => {
  const id = request.params.id;
  const newTodoText = request.body.newTodoText;
  updateTodo(id, newTodoText);
  response.redirect('/todos');
});

/* Add */
app.post('/todos', (request, response) => {
  const newTodoText = request.body.newTodoText;
  addTodo(newTodoText);
  response.redirect('/todos');
});

/* Delete */
app.post('/todos/:id/delete', (request, response) => {
  removeTodo(request.params.id);
  response.redirect('/todos');
});



app.listen(8080, () => { console.log('Running on 8080') });

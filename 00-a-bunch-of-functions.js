const fs = require('fs');

function readCounter() { return Number(fs.readFileSync('./counter')); }
function writeCounter(value) { return fs.writeFileSync('./counter', String(value));  }

function increment() { writeCounter(readCounter() + 1); }
function decrement() { writeCounter(readCounter() - 1); }
function setTo(value) { writeCounter(Number(value)); }
function reset() { setTo(0); }

// Mapping between Javascript functions and command line interface
/*
{
  const [_node, _file, operation, value] = process.argv;
  console.log('argv', process.argv)
  if (operation === 'increment') { increment(); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'decrement') { decrement(); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'set') { setTo(value); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'reset') { reset(); console.log(`After ${operation}: ${readCounter()}`)}
  else { console.log(`Count is: ${readCounter()}`) }
}
*/

/*
node 00-a-bunch-of-functions.js
node 00-a-bunch-of-functions.js increment
node 00-a-bunch-of-functions.js decrement
node 00-a-bunch-of-functions.js reset
node 00-a-bunch-of-functions.js set 100
*/

/*
GET http://localhost:8080/
GET http://localhost:8080/increment
GET http://localhost:8080/decrement
GET http://localhost:8080/reset
GET http://localhost:8080/set/100
*/

// Mapping between Javascript functions and HTTP interface
{
  const express = require('express');
  const app = express();
  const PORT = 3000;

  app.get('/', (request, response) => { response.send(`
    <h1>Count is: ${readCounter()}</h1>
    <a href='/increment'>Increment</a>
    <a href='/decrement'>Decrement</a>
    <form method='GET' action='/reset'>
      <button>Reset</button>
    </form>
    <form method='GET' action='/set'>
      <input name='newCounterValue'>
      <button>Set</button>
    </form>
  `)});

  app.get('/increment', (request, response) => { increment(); response.redirect('/') });
  app.get('/decrement', (request, response) => { decrement(); response.redirect('/') });
  app.get('/reset', (request, response) => { reset(); response.redirect('/') });
  app.get('/set', (request, response) => {
    const { newCounterValue } = request.query;
    if (newCounterValue) setTo(newCounterValue);
    response.redirect('/')
  });

  app.listen(PORT, () => { console.log(`Listening on ${PORT}!`) });
}

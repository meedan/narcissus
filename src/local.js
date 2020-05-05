const express = require('express');
const lambda = require('./index').handler;
const about = require('./about').handler;

const app = express();
const port = process.env.SERVER_PORT || 8687;

app.use(express.json());

const handleError = (e, response) => {
  console.debug(e.message);
  response.status(500).send(JSON.stringify({ error: 'Error 500, please check the logs' }));
};

const invalidRequest = (request) => (request.headers['x-api-key'] !== 'dev');

app.get('/about', (request, response) => {
  if (invalidRequest(request)) {
    response.status(403).send('Please provide the API key');
  } else {
    about().then((aboutResponse) => {
      response.status(aboutResponse.statusCode).send(aboutResponse.body);
    });
  }
});

app.get('/', (request, response) => {
  try {
    if (invalidRequest(request)) {
      response.status(403).send('Please provide the API key');
    } else {
      const requestRef = request;
      requestRef.queryStringParameters = request.query;
      lambda(request, { runningLocally: true }, (status, message) => {
        const output = {};
        if (status === 200) {
          output.url = message;
        } else {
          output.error = message;
        }
        response.status(status).send(JSON.stringify(output));
      }).then(() => {
        response.end();
      }, (e) => {
        handleError(e, response);
      });
    }
  } catch (e) {
    handleError(e, response);
  }
});

console.debug(`Starting screenshot service on port ${port}`);
app.listen(port);

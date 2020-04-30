const express = require('express');
const lambda = require('./index').handler;

const app = express();
const port = process.env.SERVER_PORT || 8687;

app.use(express.json());

app.get('/', (request, response) => {
  try {
    const requestRef = request;
    requestRef.queryStringParameters = request.query;
    lambda(request, null, (status, message) => {
      const output = {};
      if (status === 200) {
        output.url = message;
      } else {
        output.error = message;
      }
      response.status(status).send(JSON.stringify(output));
    }).then(() => {
      response.end();
    }, (error) => {
      console.error(error.message);
      response.status(500).send(JSON.stringify({ error: 'Error 500, please check the logs' }));
    });
  } catch (e) {
    console.error(e.message);
    response.status(500).send(JSON.stringify({ error: 'Error 500, please check the logs' }));
  }
});

console.log(`Starting screenshot service on port ${port}`);
app.listen(port);

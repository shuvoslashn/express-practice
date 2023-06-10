const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 6000;

// middlewares
app.use(bodyParser.json());

// Server listening
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

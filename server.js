const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 6000;

// middlewares
app.use(bodyParser.json());

//? API to check connection
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to our app' });
});

// Server listening
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

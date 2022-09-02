const express = require('express');
const session = require('express-session');
const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());

app.use(session({
    secret: '$2a$10$FAw1uaSA15NjoM1RRT9lgu5L5s6o2vJd3tjeEcX63TJWsp7spPakC',
    resave: false,
    saveUninitialized: false,
}));

app.use('/api/auth', authRoute);

app.listen(5005, () => {
    console.log('Server running on http://localhost:5005');
});

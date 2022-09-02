const {Router} = require('express');
const db = require("../../db/db");
const {hashPassword, comparePassword} = require('../utils/helpers');

const router = Router();

//Вход пользователя
router.post('/login', async (request, response) => {
    const {username, password} = request.body;

    if (!username || !password) {
        return response.sendStatus(400);
    }

    const userDB = await db('users')
        .where('username', username)
        .select('username', 'password')
        .first();

    if (!userDB) {
        return response.sendStatus(401);
    }

    const isPasswordValid = comparePassword(password, userDB.password);

    if (isPasswordValid) {
        console.log('Authenticated successfully!');
        //сохраняем пользователя
        request.session.user = userDB;

        return response.sendStatus(200);
    }
    else {
        console.log('Failed to authenticate');

        return response.sendStatus(401);
    }
});

//Регистрация нового пользователя
router.post('/register', async (req, res) => {
    const {username, password, email} = req.body;

    const userDB = await db('users')
        .where('username', username)
        .andWhere('email', email)
        .select('username', 'email')
        .first();

    if (userDB) {
        res.status(400).send({msg: 'User already exists!'});
    } else {
        const hashedPassword = hashPassword(password);

        await db('users')
            .insert({username, email, password: hashedPassword});

        res.status(201).send({msg: 'New user has been added!'});
    }
});

//Проверка сессии текущего пользователя
router.use((req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});

//Список пользователей. Нельзя получить список если пользователь не выполнил вход
router.get('/users', async (req, res) => {
    let users = await db('users')
        .select('id', 'username', 'email');

    if (users) {
        res.status(200).send(users);
    } else {
        res.status(404).send('No users found');
    }
});

module.exports = router;
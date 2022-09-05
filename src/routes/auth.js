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
        //сохраняем пользователя в сессию
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
    const {username, password, email, category_id, region_id} = req.body;

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
            .insert({username, email, password: hashedPassword, category_id, region_id});

        res.status(201).send({msg: 'New user has been added!'});
    }
});

module.exports = router;
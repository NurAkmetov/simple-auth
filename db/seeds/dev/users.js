/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    try {
        await knex('users').del()
        await knex('categories').del()
        await knex('regions').del()

        const category_id = await knex('categories').insert({name: 'paid'}, 'id');
        const region_id = await knex('regions').insert({city: 'Almaty'}, 'id');

        await knex('users').insert([
            {
                username: 'John',
                email: '123@mail.com',
                password: '$2a$10$FAw1uaSA15NjoM1RRT9lgu5L5s6o2vJd3tjeEcX63TJWsp7spPakC',
                category_id: category_id[0],
                region_id: region_id[0]
            }
        ]);
    } catch (err) {
        console.log(`Error seeding data: ${err}`);
    }
};

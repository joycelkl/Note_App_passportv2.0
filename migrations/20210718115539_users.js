exports.up = function(knex) {
    return knex.schema.createTable('users', user => {
        user.increments('id').primary();
        user.string('username');
        user.string('email');
        user.string('gmail_id');
        user.string('facebook_id');
        user.string('hash');
        user.timestamps(false, true);
    }).then(() => {
        return knex.schema.createTable('notes', note => {
            note.increments('index').primary();
            note.string('content', 1000);
            note.integer('user_id').unsigned();
            note.foreign('user_id').references('users.id');
            note.timestamps(false, true);
        })
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('notes').then(() => {
        return knex.schema.dropTable('users');
    });

};
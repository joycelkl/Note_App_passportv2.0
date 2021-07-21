exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('notes').del().then(() => {
            return knex('users').del();
        })
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([
                { name: 'Bright', password: 'win0221' },
                { name: 'Win', password: 'bright1227' },
            ]);
        }).then(() => {
            return knex('notes').insert([
                { content: 'feed Ame', user_id: 1 },
                { content: 'photo shooting', user_id: 1 },
                { content: 'shopping gift for mom', user_id: 1 },
                { content: 'feed Cartier', user_id: 2 },
                { content: 'photo shooting', user_id: 2 },
                { content: 'golf day', user_id: 2 }
            ])
        })
};
const authFunction = function(knex) {
    return function(username, password, callback) {
        let query = knex('users')
            .select('name')
            .where('name', username)
            .where('password', password);

        query.then((row) => {
                if (row.length === 1) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            })
            .catch((err) => {
                throw new Error(err);
            });
    };
};


module.exports = authFunction;
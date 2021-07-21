class NoteService {
    constructor(knex) {
        this.knex = knex;
        this.initPromise = null;
        this.init();
    }

    init() {

    }

    //retrieves the notes for a specific user
    list(user) {
        console.log(user, 'in list function')

        let userid = this.knex('users').select('id').where({ name: user });

        let query = this.knex('notes').select('index', 'content').where({ user_id: userid }).orderBy('index');

        return query.then((data) => {
            console.log(data, 'data in list function')
            return data
        })
    }

    add(newNote, user) {
        console.log('adding service');

        let userid = this.knex('users').select('id').where({ name: user });

        let query = this.knex('notes').insert({ content: newNote, user_id: userid })
        query.then(() => {
            console.log('done insert new note')
        })

        let update = this.knex('notes').select('index', 'content').where({ user_id: userid }).orderBy('index');

        return update.then((data) => {
            console.log(data, 'update data in post function')
            return data
        })
    }

    change(cindex, newcontent, user) {
        console.log('changing');

        let userid = this.knex('users').select('id').where({ name: user });

        let query = this.knex('notes').update({ content: newcontent }).where({ index: cindex })

        query.then(() => {
            console.log('changed')
        })

        let update = this.knex('notes').select('index', 'content').where({ user_id: userid }).orderBy('index');

        return update.then((data) => {
            console.log(data, 'update data in post function')
            return data
        })
    }

    delete(dindex, user) {
        console.log('deleting');

        let userid = this.knex('users').select('id').where({ name: user });

        let query = this.knex('notes').del().where({ index: dindex })

        query.then(() => {
            console.log('deleted')
        })

        let update = this.knex('notes').select('index', 'content').where({ user_id: userid }).orderBy('index');

        return update.then((data) => {
            console.log(data, 'update data in post function')
            return data
        })

    }


}

module.exports = NoteService;
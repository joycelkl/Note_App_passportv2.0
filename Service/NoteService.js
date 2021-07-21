class NoteService {
    constructor(knex) {
        this.knex = knex;

    }

    //retrieves the notes for a specific user
    list(user) {

        let userid = this.knex('users').select('id').where({ name: user });

        let query = this.knex('notes').select('index', 'content').where({ user_id: userid }).orderBy('index');

        return query.then((data) => {
            return data
        })
    }

    //adding new note
    add(newNote, user) {

        let userid = this.knex('users').select('id').where({ name: user });

        let query = this.knex('notes').insert({ content: newNote, user_id: userid })

        return query.then(() => {
            console.log('done insert new note')
        }).then(() => {
            return this.list(user);
        })

    }

    change(cindex, newcontent, user) {

        let query = this.knex('notes').update({ content: newcontent }).where({ index: cindex })

        return query.then(() => {
            console.log('changed')
        }).then(() => {
            return this.list(user);
        })


    }

    delete(dindex, user) {

        let query = this.knex('notes').del().where({ index: dindex })

        return query.then(() => {
            console.log('deleted')
        }).then(() => {
            return this.list(user);
        })
    }
}

module.exports = NoteService;
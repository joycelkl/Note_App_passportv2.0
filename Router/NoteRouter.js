const express = require("express");

class NoteRouter {
    constructor(noteService) {
        this.noteService = noteService;
    }

    router() {
        let router = express.Router();
        router.get('/', this.get.bind(this));
        router.post('/add', this.post.bind(this));
        router.put('/change/:id', this.put.bind(this));
        router.delete('/delete/:id', this.delete.bind(this));
        return router;
    }

    get(req, res) {
        console.log('router get is running')
            // return this.noteService
            //     .list(req.auth.user)
            //     .then((notes) => {
            //         res.send(notes);
            //     })
    }

    post(req, res) {
        console.log('post reqbody', req.body.add, req.auth.user)
        return this.noteService.add(req.body.add, req.auth.user)
            .then((data) => {
                console.log("posting done update", data);
                return res.send(data)
            }).catch((err) => {
                res.status(500).json(err);
            });
    }

    put(req, res) {
        console.log('put req data', req.params.id, req.body.content, req.auth.user);
        return this.noteService.change(req.params.id, req.body.content, req.auth.user).then((data) => {
            return res.send(data)
        }).catch((err) => {
            res.status(500).json(err);
        });
    }

    delete(req, res) {
        console.log('delete req data', req.params.id, req.auth.user);

        return this.noteService.delete(req.params.id, req.auth.user).then((data) => {
            return res.send(data)
        }).catch((err) => {
            res.status(500).json(err);
        });
    }

}

module.exports = NoteRouter;
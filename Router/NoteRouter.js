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

    // get router is not needing at here
    get(req, res) {
        console.log('router get is running')
    }


    post(req, res) {
        console.log('posting data', req.body.add)
        return this.noteService.add(req.body.add, req.auth.user)
            .then((data) => {
                console.log("posting done update", data);
                return res.send(data)
            }).catch((err) => {
                res.status(500).json(err);
            });
    }


    put(req, res) {

        return this.noteService.change(req.params.id, req.body.content, req.auth.user).then((data) => {
            console.log("put done update", data)
            return res.send(data)
        }).catch((err) => {
            res.status(500).json(err);
        });
    }


    delete(req, res) {

        return this.noteService.delete(req.params.id, req.auth.user).then((data) => {
            console.log('delete done update', data)
            return res.send(data)
        }).catch((err) => {
            res.status(500).json(err);
        });
    }

}

module.exports = NoteRouter;
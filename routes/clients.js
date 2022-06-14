const express = require('express');
const { route } = require('.');

var router = express.Router();
const Client = require('../models/client');

//Rutas

router.get('/', (req, res) => {
    res.render('users/brand/clientAddEdit', {
        viewTitle: "New Client"
    });
});

router.get('/clientList', (req, res) => {
    Client.find((error, docs) => {
        if (!error) {
            res.render("users/brand/clientList", {
                viewTitle: "Clientes",
                list: docs
            })
        } else {
            console.log("Error: error");
        }
    });
});

router.get('/:id', (req, res) => {
    Client.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('users/brand/clientAddEdit', {
                viewTitle: "Update Client",
                client: doc
            });
        }
    });
});



router.post('/', (req, res) => {
    if (req.body._id == '') {
        insertClient(req, res);

    } else {
        updateClient(req, res);
    }
});

//
function insertClient(req, res) {
    var client = new Client();
    client.campo1 = req.body.campo1;
    client.campo2 = req.body.campo2;
    client.save(e => {

        if (!e) {
            res.redirect('client/clientList');
        } else {
            console.log("Error: ", e)
        }
    })
}


function updateClient(req, res) {
    Client.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.render('brand/clientList', {
                viewTitle: "Update Client",
                client: req.body
            });
            res.redirect('client/clientList');
        } else {
            console.log("Error: ", err)
        }
    });
}

router.get('/delete/:id', (req, res) => {
    Client.findByIdAndRemove(req.params.id, (err) => {
        if (!err) {
            res.redirect('/client/clientList');
        } else {
            console.log("Error", err);
        }
    });
})

module.exports = router;
const express = require('express');
const { route } = require('.');

var router = express.Router();
const Brand = require('../models/brand');

//Rutas

router.get('/', (req, res) => {
    res.render('users/brand/brandAddEdit', {
        viewTitle: "New Brand"
    });
});

router.get('/brandList', (req, res) => {
    Brand.find((error, docs) => {
        if (!error) {
            res.render("users/brand/brandList", {
                viewTitle: "Brands",
                list: docs
            })
        } else {
            console.log("Error: error");
        }
    });
});

router.get('/:id', (req, res) => {
    Brand.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('users/brand/brandAddEdit', {
                viewTitle: "Update Brand",
                brand: doc
            });
        }
    });
});



router.post('/', (req, res) => {
    if (req.body._id == '') {
        insertBrand(req, res);

    } else {
        updateBrand(req, res);
    }
});

//
function insertBrand(req, res) {
    var brand = new Brand();
    brand.name = req.body.name;
    brand.description = req.body.description;
    brand.save(e => {
        if (!e) {
            res.redirect('brand/brandList');
        } else {
            console.log("Error: ", e)
        }
    })
}


function updateBrand(req, res) {
    Brand.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.render('brand/brandList', {
                viewTitle: "Update Brand",
                brand: req.body
            });
            res.redirect('brand/brandList');
        } else {
            console.log("Error: ", err)
        }
    });
}

router.get('/delete/:id', (req, res) => {
    Brand.findByIdAndRemove(req.params.id, (err) => {
        if (!err) {
            res.redirect('/brand/brandList');
        } else {
            console.log("Error", err);
        }
    });
})

module.exports = router;
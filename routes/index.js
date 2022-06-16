var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const myconn = require('express-myconnection');

const methods = require("../methods");
const User = require('../models/user');
const { Router } = require('express');

const registerPage = "../views/users/register";
const loginPage = "../views/users/login";

//*-----------------------------
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '2341',
    database: 'myhouse'
};

/*Middleware's*/
router.use(myconn(mysql, dbOptions, 'single'));


/*Consulta de informacíon*/
router.get('/home', (req, res) => {
    //if (req.user) {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);

        conn.query('SELECT * FROM products', (err, rows) => {
            if (err) return res.send(err);

            res.json(rows);
        });
    });
    //res.render('home', { userName: req.user.fullName });
    /*} else {
        res.render(loginPage, {
            message: "Debe iniciar sesión para continuar",
            messageClass: "alert-danger"
        })
    }*/
});

/*Envio de información*/
router.post('/home', (req, res) => {
    //if (req.user) {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('INSERT INTO products set ?', [req.body], (err, rows) => {
            if (err) return res.send(err);
            res.send('-- Registro insertado ---');

        });
    });

    //res.render('home', { userName: req.user.fullName });
    /*} else {
        res.render(loginPage, {
            message: "Debe iniciar sesión para continuar",
            messageClass: "alert-danger"
        })
    }*/
});

/* Eliminar información */
router.delete('/home/:id', (req, res) => {
    //if (req.user) {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err);
            res.send('-- Se ha eliminado un registro ---');

        });
    });

    //res.render('home', { userName: req.user.fullName });
    /*} else {
        res.render(loginPage, {
            message: "Debe iniciar sesión para continuar",
            messageClass: "alert-danger"
        })
    }*/
});


/* Actualizar información */
router.put('/home/:id', (req, res) => {
    //if (req.user) {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('UPDATE products set ? WHERE id= ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err);
            res.send('-- Se ha actualizado un registro ---');

        });
    });

    //res.render('home', { userName: req.user.fullName });
    /*} else {
        res.render(loginPage, {
            message: "Debe iniciar sesión para continuar",
            messageClass: "alert-danger"
        })
    }*/
});


/* Rutas bases */
router.get('/', function(req, res) {
    res.render(loginPage);
});

router.get('/register', function(req, res) {
    res.render(registerPage);
});

router.post('/register', async(req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    //Validando
    if (password === confirmPassword) {
        user = await User.findOne({ email: email })
            .then(user => {
                if (user) {
                    res.render(registerPage, {
                        message: "El usuario ya esta registrado",
                        messageClass: "alert-danger"
                    });
                } else {
                    const hashedPassword = methods.getHashedPassword(password);
                    const userDB = new User({
                        'fullName': fullName,
                        'email': email,
                        'password': hashedPassword
                    });
                    userDB.save();

                    res.render(loginPage, {
                        message: "Registro Completo",
                        messageClass: "alert-success"
                    });
                }
            })

    } else {
        res.render(registerPage, {
            message: "Las contraseñas no coinciden",
            messageClass: "alert-danger"
        });
    }
});

router.post('/', async(req, res) => {
    const { email, password } = req.body;
    const pHash = methods.getHashedPassword(password);

    user = await User.findOne({ email: email, password: pHash })
        .then(user => {
            if (user) {
                const authToken = methods.generateAuthToken();
                methods.authTokens[authToken] = user;
                res.cookie('AuthToken', authToken);
                res.redirect('/home');
            } else {
                res.render(loginPage, {
                    message: "Usuario o contraseña Invalido",
                    messageClass: "alert-danger"
                });
            }
        })
});

router.get('/logout', (req, res) => {
    res.clearCookie('AuthToken');
    return res.redirect('/');
});

//*-----------------------------

module.exports = router;
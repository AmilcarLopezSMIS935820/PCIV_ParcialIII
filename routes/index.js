var express = require('express');
var router = express.Router();
//const users = require("../usersData");
const methods = require("../methods");
const User = require('../models/user');

const registerPage = "../views/users/register";
const loginPage = "../views/users/login";

/* GET home page. */
/*router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});
*/
router.get('/home', function(req, res) {
    if (req.user) {
        res.render('home', { userName: req.user.fullName });
    } else {
        res.render(loginPage, {
            message: "Debe iniciar sesión para continuar",
            messageClass: "alert-danger"
        })
    }
});

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
        //Validar si el correo Existe
        /*if (users.data.find(u => u.email === email)) {
            res.render(registerPage, {
                message: "Usuario ya registrado",
                messageClass: "alert-success"
            });
        }

        const phash = methods.getHashedPassword(password);

        //almacenar datos
        users.data.push({
            fullName,
            email,
            password: phash
        });*/

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


    //Validar datos
    /*const dataUser = users.data.find(u => {
        return u.email == email && hashedPassword === u.password;
    });

    if (dataUser) {
        const authToken = methods.generateTokens();
        methods.authTokens[authToken] = dataUser;
        res.cookie('AuthToken', authToken);
        res.redirect('/home');
    } else {
        res.render(loginPage, {
            message: "Usuario o contraseña no existen",
            messageClass: "alert-danger"
        });
    }*/

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

module.exports = router;
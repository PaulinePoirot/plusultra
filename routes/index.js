var express = require('express');
var router = express.Router();

const beautify = require("json-beautify");
const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const path = require('path')

router.get('/', function (req, res, next) {
    console.log("GET /")

    console.log(req.session)

    res.sendFile("index.html", {root: __dirname + '/../public'})
});

router.get('/liste', function (req, res, next) {
    console.log("GET /wiki/perso")
    res.sendFile('list_character.html', {root: __dirname + '/../public/wiki'})
})

router.get('/administration', function (req, res, next) {
    console.log("GET /wiki/administration")
    res.sendFile('administration_page.html', {root: __dirname + '/../public/wiki'})
})

router.get('/connexion', function (req, res, next) {
    console.log("GET /connexion")
    res.sendFile('connexion_page.html', {root: __dirname + '/../public/wiki'})
})

router.post('/login', function (req, res, next) {
    console.log("POST /login")

    console.log(req.body)

    const user = req.body.username
    const pass = req.body.password // password is "admin"

    const user_list = JSON.parse(users)

    if (!req.session.authentified) {
        user_list.forEach(function (elem) {
                if (elem.username === user) {
                    if (bcrypt.compareSync(pass, elem.password)) {
                        req.session.authentified = true
                    }
                }
            }
        )

        if (req.session.authentified) {
            res.redirect('/')
        } else {
            res.redirect('/connexion')
        }
    } else {
        res.send("Déjà connecté")
    }
})

router.get('/session', (req, res, next) => {
    res.json(req.session)
})

router.get('/logout', function (req, res, next) {
    console.log("GET /logout")

    req.session.destroy(function (err) {
        if (err) throw err
    })
})

router.get('/quotes', function (req, res, next) {
    console.log("GET /quotes")
    res.json(JSON.parse(quotes))
})

router.get('/persos', function (req, res, next) {
    console.log("GET /persos")
    res.json(JSON.parse(persos))
})

router.get('/perso/:id', function (req, res, next) {
    console.log("GET /persos/" + req.params.id)

    var resultat = JSON.parse('{"error":"personnage non trouvé"}')

    JSON.parse(persos).forEach((elem) => {
        if (elem.pseudo.split(' ').join('').toLowerCase() === req.params.id.toLowerCase())
            resultat = elem
    })

    res.json(resultat)
})

router.get('/users', function (req, res, next) {
    res.json(JSON.parse(users))
})

router.post('/perso/add', function (req, res, next) {
    console.log('POST /perso/add')

    console.log(req.body, req.files)

    var pseudo = req.body.pseudo.split(' ').join('').toLowerCase()

    if (req.files.vignette) {
        var vignette = req.files.vignette
        let type=null

        if (req.files.vignette.mimetype === 'image/png') type = '.png'
        if (req.files.vignette.mimetype === 'image/jpg') type = '.jpg'
        if (req.files.vignette.mimetype === 'image/jpeg') type = '.jpeg'

        var vignettePath = path.join(__dirname, '/../public/theme/img/vignette/'+pseudo+type)
        var vignettePathFromRouter = '../theme/img/vignette/'+pseudo+type


        vignette.mv(vignettePath, function (err) {
            if (err) console.log(err)
        })
    }

    if (req.files.image) {
        var image = req.files.image
        let type=null

        if (req.files.image.mimetype === 'image/png') type = '.png'
        if (req.files.image.mimetype === 'image/jpg') type = '.jpg'
        if (req.files.image.mimetype === 'image/jpeg') type = '.jpeg'

        var imagePath = path.join(__dirname, '/../public/theme/img/'+pseudo+type)
        var imagePathFromRouter = '../theme/img/'+pseudo+type

        image.mv(imagePath, function (err) {
            if (err) console.log(err)
        })
    }

    var list = JSON.parse(persos)
    var obj = req.body
    var exists = false

    obj.vignette = vignettePathFromRouter
    obj.image = imagePathFromRouter

    list.forEach(function (elem) {
        if (elem.pseudo === obj.pseudo) {
            exists = true
        }
    })

    if (exists) {
        console.log("le perso existe déjà")
        res.send("KO")
    } else {
        console.log("ajout du personnage")
        list.push(obj)

        persos = beautify(list, null, 2, 50)

        fs.open('public/javascript/persos.json', 'w', function (err, fd) {
            if (err) throw err;
            fs.write(fd, persos, 'utf8', function (err, written, string) {
                if (err) throw err
            })
            // always close the file descriptor!
            fs.close(fd, (err) => {
                if (err) throw err;
            });
        });
        res.send("OK")
    }
})

router.post('/perso/delete', function (req, res, next) {
    console.log('POST /perso/delete')

    var list = JSON.parse(persos)
    var obj = req.body
    var exists = false

    list.forEach(function (elem) {
        if (elem.name === obj.name) {
            exists = true
        }
    })

    if (!exists) {
        console.log("le perso n'existe")
        res.send("personnage n'existe pas, ne peut être supprimé")
    } else {
        console.log("suppression du personnage")

        const new_list = list.filter(perso => perso.name !== obj.name)

        persos = beautify(new_list, null, 2, 50)

        fs.open('public/javascript/persos.json', 'w', function (err, fd) {
            if (err) throw err;
            fs.write(fd, persos, 'utf8', function (err, written, string) {
                if (err) throw err
            })
            // always close the file descriptor!
            fs.close(fd, (err) => {
                if (err) throw err;
            });
        });
        res.json(new_list)
    }
})

router.post('/perso/update', function (req, res, next) {
    console.log('POST /perso/update')

    console.log(req.session.authentified)

    var list = JSON.parse(persos)
    var obj = req.body
    var exists = false
    var myPerso = null

    list.forEach(function (elem) {
        if (elem.name === obj.name) {
            exists = true
            myPerso = elem
        }
    })

    console.log(myPerso)

    if (exists) {
        Object.entries(obj).forEach((elem) => {
            console.log(elem[0])

            myPerso.elem[0] = elem[1]
        })

        res.send('OK')
    } else {
        res.send('KO')
    }
})

module.exports = router;
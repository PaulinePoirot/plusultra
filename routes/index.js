var express = require('express');
var router = express.Router();

const beautify = require("json-beautify");
const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const path = require('path')


// ENDPOINT PAGES WEB
router.get('/', function (req, res, next) {
  console.log("GET /")
  res.sendFile("index.html", {root: __dirname + '/../public'})
});

router.get('/liste', function (req, res, next) {
  console.log("GET /wiki/perso")
  res.sendFile('list_character.html', {root: __dirname + '/../public/wiki'})
})

router.get('/administration', function (req, res, next) {
  console.log("GET /administration")
  if (req.session.admin) {
    res.sendFile('administration_page.html', {root: __dirname + '/../public/wiki'})
  } else {
    res.redirect('/')
  }
})

router.get('/newPerso', function (req, res, next) {
  console.log("GET /newPerso")
  res.sendFile('add_character.html', {root: __dirname + '/../public/wiki'})
})

router.get('/update', function (req, res, next) {
  console.log("GET /update")
  res.sendFile('update_perso.html', {root: __dirname + '/../public/wiki'})
})

router.get('/detail', function (req, res, next) {
  console.log("GET /detail")
  res.sendFile('detail_perso.html', {root: __dirname + '/../public/wiki'})
})

router.get('/connexion', function (req, res, next) {
  console.log("GET /connexion")
  res.sendFile('connexion_page.html', {root: __dirname + '/../public/wiki'})
})

// ENDPOINT API
router.get('/api/quotes', function (req, res, next) {
  console.log("GET /quotes")
  res.json(JSON.parse(quotes))
})

router.get('/api/persos', function (req, res, next) {
  console.log("GET /persos")
  res.json(JSON.parse(persos))
})

router.get('/api/perso/:id', function (req, res, next) {
  console.log("GET /persos/" + req.params.id)

  var resultat = JSON.parse('{"error":"personnage non trouvé"}')

  JSON.parse(persos).forEach((elem) => {
    if (elem.pseudo.split(' ').join('').toLowerCase() === req.params.id.toLowerCase())
    resultat = elem
  })

  res.json(resultat)
})

router.get('/perso/:id', function (req, res, next) {
  console.log("GET /perso/" + req.params.id)
  res.sendFile('detail_perso.html?pseudo_perso=' + req.params.id.split(' ').join('').toLowerCase(), {root: __dirname + '/../public/wiki'})
})

router.post('/api/perso/add', function (req, res, next) {
  console.log('POST /perso/add')

  var pseudo = req.body.pseudo.split(' ').join('').toLowerCase()

  if (req.files.vignette) {
    var vignette = req.files.vignette
    let type = null

    if (req.files.vignette.mimetype === 'image/png') type = '.png'
    if (req.files.vignette.mimetype === 'image/jpg') type = '.jpg'
    if (req.files.vignette.mimetype === 'image/jpeg') type = '.jpeg'

    var vignettePath = path.join(__dirname, '/../public/assets/img/vignette/' + pseudo + type)
    var vignettePathFromRouter = '../assets/img/vignette/' + pseudo + type

    vignette.mv(vignettePath, function (err) {
      if (err) console.log(err)
    })
  }

  if (req.files.image) {
    var image = req.files.image
    let type = null

    if (req.files.image.mimetype === 'image/png') type = '.png'
    if (req.files.image.mimetype === 'image/jpg') type = '.jpg'
    if (req.files.image.mimetype === 'image/jpeg') type = '.jpeg'

    var imagePath = path.join(__dirname, '/../public/assets/img/' + pseudo + type)
    var imagePathFromRouter = '../assets/img/' + pseudo + type

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

    res.redirect('/liste')
  } else {
    console.log("ajout du personnage")
    list.push(obj)

    persos = beautify(list, null, 2, 50)

    fs.open('public/js/data/persos.json', 'w', function (err, fd) {
      if (err) throw err;
      fs.write(fd, persos, 'utf8', function (err, written, string) {
        if (err) throw err
      })
      fs.close(fd, (err) => {
        if (err) throw err;
      });
    });

    res.redirect('/liste')
  }
})

router.post('/api/perso/delete', function (req, res, next) {
  console.log('POST /perso/delete')

  if (req.session.admin) {
    var list = JSON.parse(persos)
    var obj = req.body
    var exists = false

    list.forEach(function (elem) {
      if (elem.pseudo.split(' ').join('').toLowerCase() === obj.pseudo.split(' ').join('').toLowerCase()) {
        exists = true
      }
    })

    if (!exists) {
      console.log("le perso n'existe pas")
      res.send("personnage n'existe pas, ne peut être supprimé")
    } else {
      console.log("suppression du personnage")

      const new_list = list.filter(perso => perso.pseudo.split(' ').join('').toLowerCase() !== obj.pseudo.split(' ').join('').toLowerCase())

      persos = beautify(new_list, null, 2, 50)

      fs.open('public/js/data/persos.json', 'w', function (err, fd) {
        if (err) throw err;
        fs.write(fd, persos, 'utf8', function (err, written, string) {
          if (err) throw err
        })
        fs.close(fd, (err) => {
          if (err) throw err;
        });
      });
    }
    res.redirect('/administration')
  } else {
    res.redirect('/')
  }
})

router.post('/api/perso/update', function (req, res) {
  console.log('POST /perso/update')

  var list = JSON.parse(persos)
  var obj = req.body

  var objIndex = list.findIndex((elem => elem.pseudo.split(' ').join('').toLowerCase() === obj.pseudo.split(' ').join('').toLowerCase()));

  for (var value in obj) {
    list[objIndex][value] = obj[value]
  }

  persos = beautify(list, null, 2, 50)

  fs.open('public/js/data/persos.json', 'w', function (err, fd) {
    if (err) throw err;
    fs.write(fd, persos, 'utf8', function (err, written, string) {
      if (err) throw err
    })
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });

  res.redirect('/liste')
})

router.post('/api/quotes/add', function (req, res) {
  console.log('POST /api/quotes/add')

  var list = JSON.parse(quotes)
  var obj = req.body

  list.push(obj.quote)

  quotes = beautify(list, null, 2, 50)

  fs.open('public/js/data/quotes.json', 'w', function (err, fd) {
    if (err) throw err;
    fs.write(fd, quotes, 'utf8', function (err, written, string) {
      if (err) throw err
    })
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });

  res.redirect('/administration#quotes')
})

router.post('/api/quotes/delete', function (req, res) {
  console.log('POST /api/quotes/delete')

  var list = JSON.parse(quotes)
  var obj = req.body

  const new_list = list.filter(quote => quote !== obj.quote)

  quotes = beautify(new_list, null, 2, 50)

  var fd = fs.openSync('public/js/data/quotes.json', 'w')

  fs.writeSync(fd, quotes, 'utf8')

  fs.closeSync(fd)

  res.send("OK")

})


// GESTION DE LA SESSION
router.get('/connected', function (req, res, next) {
  console.log('GET /connected')

  res.json(req.session)
})

router.post('/login', function (req, res, next) {
  console.log("POST /login")

  const user = req.body.username
  const pass = req.body.password // password is "admin"

  const user_list = JSON.parse(users)

  if (!req.session.admin) {
    user_list.forEach(function (elem) {
      if (elem.username === user) {
        if (bcrypt.compareSync(pass, elem.password)) {
          req.session.admin = true
        }
      }
    }
  )

  if (req.session.admin) {
    res.redirect('/')
  } else {
    res.redirect('/connexion')
  }
} else {
  res.send("Déjà connecté")
}
})

router.get('/logout', function (req, res, next) {
  console.log("GET /logout")

  req.session.destroy(function (err) {
    if (err) throw err
  })
  res.redirect('/')
})


// EXPORT
module.exports = router;

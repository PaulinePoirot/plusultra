var express = require('express');
var router = express.Router();

const fs = require('fs')
const path = require('path')

router.get('/', function (req, res, next) {
    console.log("GET /")
    res.sendFile("index.html", {root: __dirname + '/../public'})
});

router.get('/liste', function (req, res, next) {
    console.log("GET /wiki/perso")
    res.sendFile('list_character.html', {root: __dirname + '/../public/wiki'})
})

router.get('/connexion', function (req, res, next) {
    console.log("GET /connexion")
    res.sendFile('connexion_page.html', {root: __dirname + '/../public/wiki'})
})

router.post('/connexion', function (req, res, next) {
    console.log("POST /connexion")

    const user = req.body.username
    const pass = req.body.password

    console.log(user + ' ' + pass)

    if (user === 'a' && pass === 'a') {
        //creer session


        // rediriger
        res.redirect('/')
    } else {
        res.redirect('/connexion')
    }
})

router.get('/quotes', function (req, res, next) {
    console.log("GET /quotes")
    res.json(JSON.parse(quotes))
})

router.get('/persos', function (req, res, next) {
    console.log("GET /persos")
    res.json(JSON.parse(persos))
})

router.get('/users', function (req, res, next) {
    res.json(JSON.parse(users))
})

module.exports = router;
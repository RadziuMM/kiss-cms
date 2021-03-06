/* eslint-disable no-console */
/* eslint-disable no-loop-func */
const mysql = require('mysql');
const express = require('express');
const passwordHash = require('password-hash');
const path = require('path');

const login = require('./login');
const crud = require('./crud');
const fetchData = require('./fetchData');

let logPass = [];
let css = ['0'];
let db = 'x';

const initCMS = (cms, app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('./node_modules/kiss-cms/export'));
  const router = express.Router();

  if (db === 'x') {
    throw new Error('You have not set the database! Use the setDB() command first! If you don\'t know which argument to use, check the documentation!');
  } else {
    logPass = login(db, cms);
  }
  // routes
  router.get('/cms', (_req, res) => {
    res.sendFile('index.html', { root: path.join(process.cwd(), './node_modules/kiss-cms/export') });
  });
  router.post('/cms/login', (req, res) => {
    if (req.body[0] === logPass[0] && passwordHash.verify(req.body[1], logPass[1])) {
      res.send('1');
    } else {
      res.send('0');
    }
  });
  router.post('/cms/update/user', (req, res) => {
    crud(cms, db, router, 3, req.body);
    const hashedPassword = passwordHash.generate(req.body[1]);
    logPass = [req.body[0], hashedPassword];
    res.send('1');
  });
  router.get('/cms/data', (_req, res) => {
    res.send(cms);
  });
  /// /
  app.use('/cms/insert', (req, res, next) => {
    crud(cms, db, router, 0, req.body, next);
  });
  router.post('/cms/insert', (req, res) => {
    res.send('1');
  });
  /// /
  app.use('/cms/remove', (req, res, next) => {
    crud(cms, db, router, 1, req.body, next);
  });
  router.post('/cms/remove', (req, res) => {
    res.send('1');
  });
  /// /
  app.use('/cms/edit', (req, res, next) => {
    crud(cms, db, router, 2, req.body, next);
  });
  router.post('/cms/edit', (req, res) => {
    res.send('1');
  });
  /// /
  router.get('/cms/css', (_req, res) => {
    res.send(css);
  });

  // get full db
  router.get('/API', (_req, res) => {
    res.send(fetchData.fetchData(db, cms, 3));
  });
  // get one table
  for (let i = 0; i < cms.length; i += 1) {
    router.get(`/API/${cms[i][0]}`, (_req, res) => {
      res.send(fetchData.fetchData(db, cms, 3)[i + 1]);
    });
    // get one row in table
    for (let j = 0; j < cms[i].length; j += 1) {
      router.get(`/API/${cms[i][0]}/${j + 1}`, (_req, res) => {
        res.send(fetchData.fetchData(db, cms, 3)[i + 1][j]);
      });
    }
  }

  app.use('/', router);
};

const setDB = (con) => {
  db = mysql.createConnection({
    host: con.host,
    user: con.user,
    password: con.password,
    database: con.database,
  });
  db.connect((err) => {
    if (err) {
      db.end();
      throw new Error('Kiss-CMS: Cant connect with Data Base!');
    } else {
      console.log('Kiss-CMS: Connected with Data Base!');
    }
  });
};

const sendCSS = (arg) => {
  css = [arg];
};

module.exports = { initCMS, sendCSS, setDB };

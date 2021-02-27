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

module.exports = function initCMS(cms, con, app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('./node_modules/kiss-cms/export'));
  const router = express.Router();
  // set mysql connection
  const db = mysql.createConnection({
    host: con.host,
    user: con.user,
    password: con.password,
    database: con.database,
  });
  db.connect((err) => {
    if (err) {
      console.error('Kiss-CMS: Cant connect with Data Base!');
      db.end();
    } else {
      console.log('Kiss-CMS: Connected with Data Base!');
      logPass = login(db, cms);
    }
  });
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
    logPass = [req.body[0], req.body[1]];
    res.send('1');
  });
  router.get('/cms/data', (_req, res) => {
    res.send(cms);
  });
  router.post('/cms/insert', (req, res) => {
    crud(cms, db, router, 0, req.body);
    res.send('1');
  });
  router.post('/cms/remove', (req, res) => {
    crud(cms, db, router, 1, req.body);
    res.send('1');
  });
  router.post('/cms/edit', (req, res) => {
    crud(cms, db, router, 2, req.body);
    res.send('1');
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

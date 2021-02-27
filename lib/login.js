/* eslint-disable no-console */
const passwordHash = require('password-hash');
const fetchData = require('./fetchData');

const logPass = [];
const login = (db, cms) => {
  // eslint-disable-next-line consistent-return
  db.query('SELECT * FROM user', (err, result) => {
    if (err) {
      // if table no exist
      console.error('Kiss-CMS: User no exist!');
      db.query('CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255))',
        () => {
          console.log('Kiss-CMS: Creating new user...');
          const hashedPassword = passwordHash.generate('admin');
          db.query(`INSERT INTO user (name, password) VALUES ('admin', '${hashedPassword}')`,
            () => {
              console.log('Kiss-CMS: User created!');
              console.log('Kiss-CMS: login/password');
              console.log('Kiss-CMS: admin/admin');
              login(db);
            });
        });
    } else {
      logPass.push(JSON.parse(JSON.stringify(result))[0].name);
      logPass.push(JSON.parse(JSON.stringify(result))[0].password);
      fetchData.fetchData(db, cms);
    }
  });
  return logPass;
};
module.exports = login;

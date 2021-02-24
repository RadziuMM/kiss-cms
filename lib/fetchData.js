/* eslint-disable no-console */

let curentData = [];
// eslint-disable-next-line consistent-return
const fetchData = (db, cms, int) => {
  if (int === 3) {
    return curentData;
  }
  curentData = [];
  const names = [];
  cms.forEach((name) => {
    names.push(name[0]);
  });
  curentData.push(names);
  cms.forEach((element) => {
    db.query(`SELECT * FROM ${element[0]}`, (err, Result) => {
      if (err) {
        // if table no exist
        console.error(`Kiss-CMS: Table ${element[0]} no exist!`);
        console.log('Kiss-CMS: Creating new table...');
        let rows = '';
        for (let i = 1; i < element.length; i += 1) {
          rows += `, ${element[i][0]} ${element[i][2]}`;
        }
        db.query(`CREATE TABLE ${element[0]} (id INT AUTO_INCREMENT PRIMARY KEY ${rows})`,
          (_err) => {
            if (_err) throw err;
            console.log('Kiss-CMS: Table created!');
          });
      } else {
        // check is row are correct
        db.query(`SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_NAME = '${element[0]}'`, (_err, result) => {
          if (_err) throw err;
          const columns = JSON.parse(JSON.stringify(result));
          const colNames = [];
          columns.forEach((ele) => {
            if (ele.COLUMN_NAME !== 'id') {
              colNames.push(ele.COLUMN_NAME);
            }
          });
          colNames.sort();
          const colNamesEq = [];
          cms.forEach((e) => {
            if (e[0] === element[0]) {
              for (let i = 1; i < e.length; i += 1) {
                colNamesEq.push(e[i][0]);
              }
              colNamesEq.sort();
            }
          });
          if (JSON.stringify(colNames) === JSON.stringify(colNamesEq)) {
            const dbResult = JSON.parse(JSON.stringify(Result));
            curentData.push(dbResult);
          } else {
            console.error(`Kiss-CMS: ${element[0]} fail test!`);
            console.log('Kiss-CMS: Rebuliding table...');
            console.log('Kiss-CMS: All data will be lost!');
            db.query(`DROP TABLE ${element[0]}`, () => {
            });
            fetchData(db, cms);
          }
        });
      }
    });
  });
};
module.exports = { fetchData };

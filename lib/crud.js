/* eslint-disable no-shadow */
/* eslint-disable no-console */
const fetchData = require('./fetchData');

const crud = (cms, db, router, option, arg) => {
  const insert = (arg) => {
    cms.forEach((element) => {
      if (arg[0] === element[0]) {
        const array = [];
        element.forEach((ele) => {
          array.push(ele[0]);
        });
        array.shift();
        let variables = '';
        let values = '';
        let i = 1;
        array.forEach((ele) => {
          variables += `${ele},`;
          values += `"${arg[i]}",`;
          i += 1;
        });
        variables = variables.substring(0, variables.length - 1);
        values = values.substring(0, values.length - 1);
        db.query(`INSERT INTO ${arg[0]} (${variables}) VALUES (${values})`, (err) => {
          if (err) throw err;
          console.log('Kiss-CMS: New insert!');
          fetchData.fetchData(db, cms, router);
        });
      }
    });
  };
  const remove = (arg) => {
    db.query(`DELETE FROM ${arg[0]} WHERE id ='${arg[1]}' `, (err) => {
      if (err) throw err;
      console.log('Kiss-CMS: Row removed!');
      fetchData.fetchData(db, cms, router);
    });
  };
  const edit = (arg) => {
    let string = '';
    cms.forEach((element) => {
      if (element[0] === arg[0][0]) {
        let counter = 0;
        element.forEach((ele) => {
          if (counter === 0) {
            //
          } else {
            string += ` ${ele[0]} = '${arg[1][counter - 1]}',`;
          }
          counter += 1;
        });
      }
    });
    string = string.substr(0, string.length - 1);
    db.query(`UPDATE ${arg[0][0]} SET ${string}  WHERE id ='${arg[0][1]}' `, (err) => {
      if (err) throw err;
      console.log('Kiss-CMS: Row updated!');
      fetchData.fetchData(db, cms, router);
    });
  };
  if (option === 0) insert(arg);
  if (option === 1) remove(arg);
  if (option === 2) edit(arg);
};
module.exports = crud;

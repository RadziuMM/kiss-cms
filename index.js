import mysql from 'mysql'
import express from 'express'
import path from 'path'; 

export default function  (cms,con, app) {
    const logPass = []
    let curentData = []
    ///
    /// GET DATA FROM DATA BASE
    ///
    const fetchCMSdata = () =>{
      curentData = []
      const names =[]
      cms.forEach(name => {
        names.push(name[0])
      })
      curentData.push(names)
      cms.forEach(element => {
        db.query(`SELECT * FROM ${element[0]}`,function (err, Result, fields) {
          if (err) {
            // if table no exist
            console.error(`Kiss-CMS: Table  ${element[0]} no exist!`);
            console.log("Kiss-CMS: Creating new table...");
            let rows ='';
            for(let i = 1;i<element.length;i+=1){
              rows +=`, ${element[i][0]} ${element[i][2]}`;
            }
            db.query(`CREATE TABLE ${element[0]} (id INT AUTO_INCREMENT PRIMARY KEY ${rows})`,
            function (err, result) {
              if(err) throw err;
              console.log("Kiss-CMS: Table created!");
            })
          } else{
             //check is row are correct
             db.query(`SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_NAME = '${element[0]}'`,function (err, result) {
              if(err) throw err;
              const columns =  JSON.parse(JSON.stringify(result));
              const col_names = [];
              columns.forEach(element =>{
                if(element.COLUMN_NAME !=='id'){
                  col_names.push(element.COLUMN_NAME)
                }
              })
              col_names.sort();
              const col_names_eq = []
              cms.forEach(e=>{
                if(e[0]===element[0]){
                  for(let i =1;i<e.length;i+=1){
                    col_names_eq.push(e[i][0])
                  }
                  col_names_eq.sort();
                }
              })
              if(JSON.stringify(col_names)==JSON.stringify(col_names_eq)){
                const dbResult = JSON.parse(JSON.stringify(Result))
                curentData.push(dbResult);
                onAPI();
              }else{
                console.error(`Kiss-CMS: ${element[0]} fail test!`)
                console.log('Kiss-CMS: Rebuliding table...')
                console.log('Kiss-CMS: All data will be lost!')
                db.query(`DROP TABLE ${element[0]}`,function (err, result) {
                })
                fetchCMSdata();
              }
            })
          }
        });
      });
    }
    ///
    /// LOGIN   (add $sha256 or md5)
    ///
    const fetchLog = () => {
      db.query("SELECT * FROM user",function (err, result, fields) {
        if (err) {
          // if table no exist
          console.error("Kiss-CMS: User no exist!");
          db.query("CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255))",
          function (err, result) {
            console.log("Kiss-CMS: Creating new user...");
            db.query("INSERT INTO user (name, password) VALUES ('admin', 'admin')",
            function (err, result) {
              console.log("Kiss-CMS: User created!");
              console.log("Kiss-CMS: login/password");
              console.log("Kiss-CMS: admin/admin");
              fetchLog();
            })
          })
        } else{
          logPass.push( JSON.parse(JSON.stringify(result))[0].name);
          logPass.push( JSON.parse(JSON.stringify(result))[0].password);
          fetchCMSdata();
        }
      });
    }
    ///
    /// MYSQL SETTINGS
    ///
    const db = mysql.createConnection({
      host: con.host,
      user: con.user,
      password: con.password,
      database : con.database
    });
    db.connect(function(err) {
      if (err) {
        console.error("Kiss-CMS: Cant connect with Data Base!");
        db.end();
      } else{
        console.log("Kiss-CMS: Connected with Data Base!");
        fetchLog();
      }
    });
    ///
    /// CRUD FUNCTIONS
    ///
    const insert = (arg) => {
      cms.forEach(element=>{
        if(arg[0]===element[0]){
          const array = []
          element.forEach(ele=>{
            array.push(ele[0])
          })
          array.shift();
          let variables = ''
          let values = ''
          let i = 1;
          array.forEach(ele=>{
            variables += `${ele},`
            values += `"${arg[i]}",`
            i+=1;
          })
          variables = variables.substring(0,variables.length-1)
          values = values.substring(0,values.length-1)
          db.query(`INSERT INTO ${arg[0]} (${variables}) VALUES (${values})`,function (err, result) {
            if(err) throw err;
            console.log('Kiss-CMS: New insert!') 
            fetchCMSdata();
          })
        }
      })
    }
    const remove = (arg) =>{
      console.log(arg)
      db.query(`DELETE FROM ${arg[0]} WHERE id ='${arg[1]}' `,function (err, result) {
        if(err) throw err;
        console.log('Kiss-CMS: Row removed!') 
        fetchCMSdata();
      })
    }
    const edit = (arg) =>{
      let string = ''
      cms.forEach(element =>{
        if(element[0]===arg[0][0]){
          let counter = 0;
          element.forEach(ele =>{
            if(counter===0){}else{
              string += ` ${ele[0]} = '${arg[1][counter-1]}',`
            }
            counter+=1;
          })
        }
      })
      string = string.substr(0, string.length -1);
      db.query(`UPDATE ${arg[0][0]} SET ${string}  WHERE id ='${arg[0][1]}' `,function (err, result) {
        if(err) throw err;
        console.log('Kiss-CMS: Row updated!') 
        fetchCMSdata();
      })
    }
    ///
    ///  EXPRESS SETINGS
    ///
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('./node_modules/kiss-cms/export'));
    const router = express.Router();
    ///
    /// APP ENDPOINTS
    ///
    router.get('/cms', (req,res) => {
      res.sendFile('index.html', { root: path.join(process.cwd(), './node_modules/kiss-cms/export') });
    });
    //login
    router.post('/cms/login', (req,res) => {
      if(req.body[0]===logPass[0]&&req.body[1]===logPass[1]){
        res.send('1'); 
      }else{
        res.send('0'); 
      }
    });
    ///
    /// CMS ENDPOINTS
    ///
    //get cms structure
    router.get('/cms/data', (req,res) => {
      res.send(cms); 
    });
    // create
    router.post('/cms/insert', (req,res) => {
      insert(req.body);
      res.send('1'); 
    });
      // read
    router.get('/cms/curentData', (req,res) => {
      res.send(curentData); 
    });
      // update
    router.post('/cms/edit', (req,res) => {
      edit(req.body);
      res.send('1'); 
    });
    // delete
    router.post('/cms/remove', (req,res) => {
      remove(req.body);
      res.send('1'); 
    });
    ///
    /// API ENDPOINTS
    ///
    const onAPI = () => {
      // get full db
      router.get('/API', (req,res) => {
        res.send(curentData); 
      });
      // get one table
      for(let i = 0;i<cms.length;i +=1){
        router.get(`/API/${cms[i][0]}`, (req,res) => {
          res.send(curentData[i+1]); 
        });
        // get one row in table
        for(let j = 0;j<cms[i].length;j+=1){
          router.get(`/API/${cms[i][0]}/${j}`, (req,res) => {
            res.send(curentData[i+1][j]); 
          });
        }
      }
    }
    app.use('/', router);
}
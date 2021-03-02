# KISS-CMS

KISS-CMS is a node.js library for generating cms with MYSQL DB

## Installation

You need a express library.

```bash
yarn add kiss-cms express
```
or
```bash
npm i kiss-cms express 
```

## Usage
### How its work?
This package genereating a CMS at 
`www.${youreWebSiteURL.com}/cms`

### Syntax
```javascript
import express from 'express';
import kisscms from 'kiss-cms';

const app = express();
const port = 3000;

const cms = [
  ['table_name',['name','HTML_input_type','DB_cell_type'],['name','HTML_input_type','DB_cell_type'],...etc],
  ['table_name',['name','HTML_input_type','DB_cell_type'],,...etc],
  ..etc
];

kisscms.setDB({
  host: "***",
  user: "***",
  password: "***",
  database:	"***"
})
kisscms.initCMS(cms, app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
```
### Change CSS
If you think (you should) that my css is not the best, you can create your own. You need to make a .css file and import it as a string through the fs library for example.
```javascript
import  fs from 'fs';

fs.readFile('./index.css', function (err, res) {
 kisscms.sendCSS( res.toString())
});
```
You should use sendCSS() before initCMS().Of course sendCSS() is optional and if you don't use it the default css will be loaded.
### Example
```javascript
import  fs from 'fs';
import express from 'express';
import kisscms from 'kiss-cms';

const app = express();
const port = 8080;


app.use(express.static('public'));
router.get('/', (_req, res) => {
  res.sendFile('index.html') 
});

const cms = [
  ['post',['autor','text','VARCHAR(256)'],['title','text','VARCHAR(256)'],['content','text','VARCHAR(256)'],['date','date','DATE']],
  ['photo',['photography','file','BLOB'],['title','text','VARCHAR(256)']],
  ['mail',['addres','text','VARCHAR(256)'],['title','text','VARCHAR(256)'],['content','text','VARCHAR(256)']]
];

fs.readFile('./index.css', function (err, res) {
 kisscms.sendCSS( res.toString())
});

kisscms.setDB({
  host: "ShmitDB.amazonaws.com",
  user: "Shmit123",
  password: "abc123",
  database:	"yes"
})

kisscms.initCMS(cms, app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
```
## Endpoints
Wanna fetch some data from db?
Use this endpoints (ofc u need first provide youre site addres and then add endpoint after '/')
```bash
/API                       - get all records from  all tables 
/API/table_name           - get all records from table 
/API/table_name/number    - get ${number} record from table
```
## Usefull information
1.If u looking free mysql DB i recommend JawsDB plugin on heroku.

2.Yes i will change that ugly css.(if u have idea send me .pdf/.xd/figma)

## Contributing
https://github.com/RadziuMM/kiss-cms

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
GNU GPL
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

const con = {
  host: "***",
  user: "***",
  password: "***",
  database:	"***"
}; 

const cms = [
  ['table_name',['name','HTML_input_type','DB_cell_type'],['name','HTML_input_type','DB_cell_type'],...etc],
  ['table_name',['name','HTML_input_type','DB_cell_type'],,...etc],
  ..etc
];

kisscms(cms, con, app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
```
### Example
```javascript
import express from 'express';
import kisscms from 'kiss-cms';

const app = express();
const port = 8080;

const con = {
  host: "ShmitDB.amazonaws.com",
  user: "Shmit123",
  password: "abc123",
  database:	"yes"
}; 

const cms = [
  ['post',['autor','text','VARCHAR(256)'],['title','text','VARCHAR(256)'],['content','text','VARCHAR(256)'],['date','date','DATE']],
  ['photo',['photography','file','BLOB'],['title','text','VARCHAR(256)']],
  ['mail',['addres','text','VARCHAR(256)'],['title','text','VARCHAR(256)'],['content','text','VARCHAR(256)']]
];

kisscms(cms, con, app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
```
## Endpoints
Wanna fetch some data from db?
Use this endpoints (ofc u need first provide youre site addres and then add endpoint after '/')
```bash
/API          - get all records from  all tables 
/API/table_name       - get all records from table 
/API/table_name/number    - get ${number} record from table
```
## Usefull information
1.If u looking free mysql DB i recommend JawsDB plugin on heroku.

2.Yes i will change that ugly css.(if u have idea send me .pdf/.xd/figma)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
GNU GPL
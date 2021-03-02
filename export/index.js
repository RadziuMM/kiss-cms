/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// generate borderplate

const css = `
body {
  text-align: center;
  padding: 0;
  margin: 0;
}
#loginBox {
  border: 1px solid black;
  border-radius: 15px;
  padding: 25px;
  padding-top: 40px;
  position: absolute;
  margin-top: 50vh;
  margin-left: 50vw;
  transform: translate(-50%, -100%);
}
#loginBox button {
  cursor: pointer;
}
.label {
  position: absolute;
  margin-left: 10px;
  transform: translate(0, -50%);
  background-color: white;
  font-size: small;
}
.login {
  border-radius: 25px;
  text-align: center;
  height: 20px;
  outline: none;
}

nav {
  position: fixed;
  top: 0;
  width: 100vw;
  text-align: right;
  padding: 5px;
  background-color: rgb(199, 199, 199);
  border-bottom: 1px black solid;
  z-index: 100;
}
nav button {
  transform: translate(-50%, 0);
}

#contentBox {
  margin-top: 50px;
  display: none;
}
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cmsInput {
  margin: 15px;
  margin-left: 50vw;
  transform: translate(-50%, 0);
  width: calc(fit-content + 100px);
  order: 1;
  border: 1px solid black;
  border-radius: 15px;
  padding: 15px !important;
}
.cmsInput h3 {
  text-transform: uppercase;
}
.cmsFormInput {
  width: 200px;
  outline: none;
  margin-bottom: 10px;
}
input::-webkit-file-upload-button {
  outline: none;
  width: 100px;
  border: 1px solid black;
  padding: 10px;
  background-color: white;
  cursor: pointer;
}
#data {
  order: 2;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
li {
  border: 1px solid black;
  border-radius: 10px 10px 0 0;
  width: 50vw;
  margin-left: 50vw;
  transform: translate(-50%, 0);
}
.buttons {
  border-bottom: solid 1px black;
  border-radius: 10px 10px 0 0;
  padding: 5px;
  text-align: left;
  background-color: rgb(199, 199, 199);
}
.buttons button {
  text-transform: capitalize;
  margin-left: 5px;
}
.info {
  padding: 20px;
  text-align: left;
}
.editInfo {
  border: 1px solid black;
  border-top: none;
  text-align: left;
  width: 50vw;
  margin-left: 50vw;
  transform: translate(-50%, 0);
  display: none;
}
.edited {
  padding: 10px;
}
.edited input {
  width: 200px;
  outline: none;
}
#options {
  position: fixed;
  background-color: #fff;
  top: 0;
  left: 0;
  margin-top: 50vh;
  margin-left: 50vw;
  transform: translate(-50%, -50%);
  z-index: 500;
  width: 400px;
  height: 400px;
  border: solid black 1px;
  display: none;
}
#options button:first-child {
  float: right;
  margin: 5px;
}
.changeUser {
  margin-top: 50px;
}
#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  opacity: 0.3;
  display: none;
}
`;

const genborderplate = () => {
  document.getElementById('cms').innerHTML = `
    <div id="loginBox"  name="form">
        <form action="javascript:login()">
            <label for="fLogin" class="label">login</label>
            <input id="login" name="fLogin" class="login" autocomplete="off" required /><br/><br/>
            <label for="fPass" class="label">password</label>
            <input id="pass" name="fPass" class="login" type="password" autocomplete="off" required /><br/><br/>
            <button >Log In</button>
        </form>
    </div>
    <div id="contentBox">
      <div id="app"></div>
    </div>
    `;
};
genborderplate();

// get cms

let cms;
fetch('../cms/data')
  .then((res) => res.json())
  .then((res) => {
    cms = res;
  }).catch((_err) => {
    if (_err) alert('server no respond!');
  });

// get css

fetch('../cms/css')
  .then((res) => res.json())
  .then((res) => {
    const data = JSON.parse(JSON.stringify(res))[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    if (data !== '0') {
      style.innerText = `
      ${css}
      ${data}
      `;
    } else {
      style.innerText = `${css}`;
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  }).catch((_err) => {
    if (_err) console.log(_err);
  });

// get data

const getdata = () => {
  fetch('../API')
    .then((res) => res.json())
    .then((res) => {
      const names = res[0];
      res.shift();
      document.getElementById('table').remove();
      const table = document.createElement('ul');
      table.id = 'table';
      const dataTable = [];
      let counter = 0;
      res.forEach((array) => {
        array.forEach((row) => {
          const x = Object.entries(row);
          x[0][0] = names[counter];
          dataTable.push(x);
        });
        counter += 1;
      });
      dataTable.forEach((element) => {
        let string = `<from><li id='row${element[0][0]}${element[0][1]}'>`;
        let counter0 = 0;
        element.forEach((entries) => {
          if (counter0 === 0) {
            string += `<div class="buttons">
                    <button id="edit${entries[0]}${entries[1]}" onclick='editRow("${entries[0]}" , "${entries[1]}")'>edit</button>
                    <button onclick='deleteRow("${entries[0]}" , "${entries[1]}")'>remove</button>
                    </div>
                    <div class="info" id='info${entries[0]}${entries[1]}'>`;
          } else {
            string += `<div>${entries[0]} : ${entries[1]}</div>`;
          }
          counter0 += 1;
        });
        string += `</div></li>
            <div id='editInfo${element[0][0]}${element[0][1]}' class="editInfo"></div></form>`;
        string += '<br/><br/>';
        table.innerHTML += string;
      });
      document.getElementById('data').innerHTML += '<h2>All of your entries</h2>';
      document.getElementById('data').appendChild(table);
    }).catch((err) => {
      // alert('server no respond!')
      console.log(err);
    });
};
// update table
const update = () => {
  console.log('update time!');
  getdata();
};
//  generete html

const gen = () => {
  const structure = `
   <nav>
    <button onclick="options()">Options</button>
    <button onclick="logout()">Log Out</button> 
  </nav>
  <div id="options">
    <button onclick="options()">Close</button>
    <div class="changeUser">
      <form action="javascript:changeUserData()">
        <label for="fLogin" class="label">new login</label>
        <input id="changeLogin" name="fLogin" class="login" autocomplete="off" required /><br/><br/>
        <label for="fPass" class="label">new password</label>
        <input id="changePass" name="fPass" class="login" type="password" autocomplete="off" required /><br/><br/>
        <label for="fPass" class="label">new password</label>
        <input id="changePassReapeat" name="fPass" class="login" type="password" autocomplete="off" required /><br/><br/>
        <button >Change Login/Password</button>
      </form>
    </div>
  </div>
  <div id="overlay"></div>`;
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('contentBox').style.display = 'block';
  document.getElementById('contentBox').innerHTML += `${structure}`;
  const app = document.getElementById('app');
  cms.forEach((element) => {
    let cmsTable = '';
    for (let i = 1; i < element.length; i += 1) {
      cmsTable += `
            <div class='cmsHolder'>
            <label for="${element[0]}${i - 1}" class="label">${element[i][0]}</label>
            <input id="${element[0]}${i - 1}" type="${element[i][1]}" name="${element[0]}${i - 1}" autocomplete="off" class="cmsFormInput" required />
            </div>
            `;
    }
    const newElement = document.createElement('div');
    newElement.className = 'cmsInput';
    newElement.innerHTML += `
        <h3>${element[0]}</h3>
        <form action="javascript:add(['${element[0]}',${element.length - 1}])">
        ${cmsTable}
        <button>ADD</button>
        </form>
        <br/>
        `;
    app.appendChild(newElement);
  });
  const data = document.createElement('div');
  data.id = 'data';
  app.appendChild(data);
  getdata();
};

//  html  onclicks

const login = () => {
  const log = [
    document.getElementById('login').value,
    document.getElementById('pass').value,
  ];
  document.getElementById('login').value = '';
  document.getElementById('pass').value = '';
  const request = new Request('../cms/login', {
    method: 'POST',
    body: JSON.stringify(log),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  fetch(request)
    .then((res) => res.json())
    .then((res) => {
      if (res === 1) {
        gen();
      } else {
        alert('bad login or pass!');
      }
    });
};
const logout = () => {
  document.getElementById('loginBox').style.display = 'block';
  document.getElementById('contentBox').style.display = 'none';
  document.getElementById('contentBox').innerHTML = '<div id ="app"></div>';
};
const add = (arg) => {
  const send = [];
  send.push(arg[0]);
  for (let i = 0; i < arg[1]; i += 1) {
    send.push(`${document.getElementById(`${arg[0]}${i}`).value}`);
  }
  const request = new Request('../cms/insert', {
    method: 'POST',
    body: JSON.stringify(send),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  fetch(request)
    .then((res) => res.json())
    .then((_res) => {
      console.log('New insert');
      update();
    });
};
let isEditing = false;
const editRow = (arg0, arg1) => {
  if (isEditing) {
    // true
    const button = document.getElementsByTagName('button');
    for (let i = 0; i < button.length; i += 1) {
      button[i].disabled = false;
    }
    document.getElementById(`edit${arg0}${arg1}`).innerHTML = 'edit';
    document.getElementById(`info${arg0}${arg1}`).style.display = 'block';
    document.getElementById(`editInfo${arg0}${arg1}`).style.display = 'none';

    let counter = 0;
    let stopAt;
    cms.forEach((element) => {
      if (element[0] === arg0) {
        stopAt = counter;
      }
      counter += 1;
    });
    let counter0 = 0;
    const sendData = [];
    cms[stopAt].forEach((element) => {
      if (counter0 === 0) {
        //
      } else {
        sendData.push(document.getElementById(`edited${element[0]}`).value);
      }
      counter0 += 1;
    });
    document.getElementById(`editInfo${arg0}${arg1}`).innerHTML = '';
    const request = new Request('../cms/edit', {
      method: 'POST',
      body: JSON.stringify([[arg0, arg1], sendData]),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    fetch(request)
      .then((res) => res.json())
      .then((_res) => {
        console.log('One row has been edited');
        update();
      });

    isEditing = false;
  } else {
    // false
    const button = document.getElementsByTagName('button');
    for (let i = 0; i < button.length; i += 1) {
      button[i].disabled = true;
    }
    document.getElementById(`edit${arg0}${arg1}`).disabled = false;
    document.getElementById(`edit${arg0}${arg1}`).innerHTML = 'save!';
    document.getElementById(`info${arg0}${arg1}`).style.display = 'none';
    let counter = 0;
    let stopAt;
    cms.forEach((element) => {
      if (element[0] === arg0) {
        stopAt = counter;
      }
      counter += 1;
    });
    const editInfo = document.getElementById(`editInfo${arg0}${arg1}`);
    editInfo.style.display = 'block';
    let string = '';
    let counter0 = 0;
    cms[stopAt].forEach((element) => {
      if (counter0 === 0) {
        //
      } else {
        string += `
                <div class="edited">
                    <label for="${element[0]}" class="label">${element[0]}</label>
                    <input id="edited${element[0]}" name="edited${element[0]}" type="${element[1]}"  autocomplete="off" required />
                </div>`;
      }
      counter0 += 1;
    });
    editInfo.innerHTML = string;

    isEditing = true;
  }
};
const deleteRow = (arg0, arg1) => {
  const send = [arg0, arg1];
  const request = new Request('../cms/remove', {
    method: 'POST',
    body: JSON.stringify(send),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  fetch(request)
    .then((res) => res.json())
    .then((_res) => {
      console.log('One row has been removed');
      update();
    });
};

let isOption = false;
const options = () => {
  const overlay = document.getElementById('overlay');
  const option = document.getElementById('options');
  if (isOption) {
    overlay.style.display = 'none';
    option.style.display = 'none';
    isOption = false;
  } else {
    overlay.style.display = 'block';
    option.style.display = 'block';
    isOption = true;
  }
};

const changeUserData = () => {
  const login0 = document.getElementById('changeLogin').value;
  const pass0 = document.getElementById('changePass').value;
  const pass1 = document.getElementById('changePassReapeat').value;
  if (pass0 === pass1) {
    const send = [login0, pass0];
    document.getElementById('changeLogin').value = '';
    document.getElementById('changePass').value = '';
    document.getElementById('changePassReapeat').value = '';
    options();
    const request = new Request('../cms/update/user', {
      method: 'POST',
      body: JSON.stringify(send),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    fetch(request)
      .then((res) => res.json())
      .then((_res) => {
        alert('User data was changed!');
      });
  } else {
    alert('Passwords are difrent.Try again');
  }
};

/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// generate borderplate

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
        <nav>
          <button onclick="options()">Options</button>
          <button onclick="logout()">Log Out</button> 
        </nav>
        <div id="app">
        </div>
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
        <div id="overlay"></div>
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
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    if (res !== '0') {
      link.setAttribute('href', `../../../${res}`);
    } else {
      link.setAttribute('href', './style.css');
    }
    document.getElementsByTagName('head')[0].appendChild(link);
  }).catch((_err) => {
    if (_err) alert('server no respond!');
  });

// get data

const getdata = () => {
  fetch('../API')
    .then((res) => res.json())
    .then((res) => {
      const names = res[0];
      res.shift();
      const table = document.createElement('ul');
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

//  generete html

const gen = () => {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('contentBox').style.display = 'block';
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
  document.getElementById('app').innerHTML = '';
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

'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-05-27T17:01:17.194Z',
    '2024-08-04T23:36:17.929Z',
    '2024-08-06T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////////////////////////
/*functions*/

//formatin gnumbers

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//displaying movements

const displayMovements = function (acc, sort = false) {
  if (sort) {
    btnSort.style.color = 'grey';
  } else btnSort.style.color = 'black';

  const move = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  move.forEach(function (mov /*value*/, i /*index*/) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${Update_Date(
       acc.movementsDates[i],
       acc.locale
     )}</div>
          <div class="movements__value">${formatCur(
            acc.movements[i],
            acc.locale,
            acc.currency
          )}</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//creating usernames
const createUserNames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

//creating balance

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    account.balance,
    account.locale,
    account.currency
  )}`;
};

//creating summary

const calaDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    });
  labelSumIn.textContent = `${formatCur(
    incomes,
    currentaccount.locale,
    currentaccount.currency
  )}`;
  const outcomes = account.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumOut.textContent = `${formatCur(
    Math.abs(outcomes),
    currentaccount.locale,
    currentaccount.currency
  )}`;

  const interest = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov, i) {
      return (mov * account.interestRate) / 100;
    })
    .filter(function (mov, i) {
      return mov >= 1;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumInterest.textContent = `${formatCur(
    interest,
    currentaccount.locale,
    currentaccount.currency
  )}`;
};

//get username

const getUserName_login = function (accounts) {
  const currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  return currentAccount;
};
const getUserName_transfer = function (accounts) {
  const currentAccount = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  return currentAccount;
};

const UpdateUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calaDisplaySummary(account);
};

const Update_Date = function (date, local) {
  date = new Date(date);
  const daysPassed = Math.round(
    Math.abs(date - new Date()) / (1000 * 60 * 60 * 24)
  );
  if (daysPassed == 0) return 'Today';
  if (daysPassed == 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  date = new Date(date);

  new Intl.DateTimeFormat(local, options).format(date);
  return new Intl.DateTimeFormat(local).format(date);
};

//logout

const startLogOut = function () {
  let time = 600;
  const logoutfunction = function () {
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  logoutfunction();
  //set time to 5 minutes

  timer = setInterval(logoutfunction, 1000);
  console.log(timer);
  return timer;
};

/*event handlers*/

let currentaccount, timer;

const options = {
  hour: 'numeric',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  weekday: 'short',
  /*we can use 1-numeric ,2-(2-digit),3-long,4-short*/
};

//specify the lang of my computer

// const local=navigator.language;
// console.log(local);

/*iso language code table --->from google*/

//login

btnLogin.addEventListener('click', function (event) {
  //prevent form from sumbitting
  event.preventDefault();
  const currentAccount = getUserName_login(accounts);

  if (!currentAccount) {
    labelWelcome.textContent = 'Invalid username';
    containerApp.style.opacity = 0;
    inputLoginUsername.focus();
    return;
  }
  if (currentAccount?.pin === Number(inputLoginPin?.value)) {
    if (currentAccount !== currentaccount) {
      currentaccount = currentAccount;
      //display UI and mwssages
      labelWelcome.textContent = `Welcome back ${
        currentAccount.owner.split(' ')[0]
      }`;
      labelDate.textContent = new Intl.DateTimeFormat(
        currentaccount.locale,
        options
      ).format(new Date());
      containerApp.style.opacity = 100;
      /*clear input fields*/
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
      UpdateUI(currentAccount);
      if (timer) clearInterval(timer);
      timer = startLogOut();
    }
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Invalid password';
    inputLoginPin.focus();
  }
});

btnLogin.addEventListener('keydown', function (e) {
  if (e.key === 'enter') {
    btnLogin.click();
  }
});

inputLoginUsername.addEventListener('keydown', function (e) {
  /*right arrow*/
  if (e.key === 'ArrowRight') {
    inputLoginPin.focus();
  }
  if (e.key === 'ArrowDown') {
    inputTransferTo.focus();
  }
});

inputLoginPin.addEventListener('keydown', function (e) {
  /*left arrow*/
  if (e.key === 'ArrowLeft') {
    inputLoginUsername.focus();
  }
  if (e.key === 'enter') {
    btnLogin.click();
  }
  if (e.key === 'ArrowDown') {
    inputTransferAmount.focus();
  }
});

/*transfer coins*/

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = getUserName_transfer(accounts);
  if (!recieverAccount) {
    alert('invalid reciever');
    inputTransferTo.focus();
    return;
  }
  if (
    amount > 0 &&
    recieverAccount &&
    recieverAccount !== currentaccount &&
    currentaccount.balance >= amount
  ) {
    currentaccount.movements.push(-amount);
    currentaccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movements.push(amount);
    recieverAccount.movementsDates.push(new Date().toISOString());
    UpdateUI(currentaccount);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    if(timer) clearInterval(timer);
    timer=startLogOut();
  } else {

    inputTransferAmount.focus();
    alert('invalid transfer');
  }
});

btnTransfer.addEventListener('keydown', function (e) {
  if (e.key === 'enter') {
    btnTransfer.click();
  }
});

inputTransferTo.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    inputTransferAmount.focus();
  }
  if (e.key === 'ArrowDown') {
    inputLoanAmount.focus();
  }
  if (e.key === 'ArrowUp') {
    inputLoginUsername.focus();
  }
});

inputTransferAmount.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    inputTransferTo.focus();
  }
  if (e.key === 'enter') {
    btnTransfer.click();
  }
});

/*loan*/
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentaccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    setTimeout(function () {
      currentaccount.movements.push(amount);
      currentaccount.movementsDates.push(new Date().toISOString());
      UpdateUI(currentaccount);
      inputLoanAmount.value = '';
    }, 2500);
    if(timer) clearInterval(timer);
    timer=startLogOut();
  } else {
    alert('invalid loan');
    inputLoanAmount.focus();
  }
});

btnLoan.addEventListener('keydown', function (e) {
  if (e.key === 'enter') {
    btnLoan.click();
  }
});

/*close account*/

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentaccount);
  console.log(currentaccount.username === inputCloseUsername.value);
  console.log(currentaccount.pin === Number(inputClosePin));
  console.log(Number(inputClosePin));
  if (
    currentaccount.username === inputCloseUsername.value &&
    currentaccount.pin === Number(inputClosePin.value)
  ) {
    console.log(currentaccount);
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentaccount.username;
    });
    console.log(index);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Account closed';
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    inputClosePin.blur();
  } else {
    alert('invalid credentials');
    inputCloseUsername.focus();
  }
});

btnClose.addEventListener('keydown', function (e) {
  if (e.key === 'enter') {
    btnClose.click();
  }
});

inputCloseUsername.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    inputClosePin.focus();
  }
  if (e.key === 'ArrowUp') {
    inputLoanAmount.focus();
  }
});

inputClosePin.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    inputCloseUsername.focus();
  }
  if (e.key === 'enter') {
    btnClose.click();
  }
  if (e.key === 'ArrowUp') {
    inputLoanAmount.focus();
  }
});

/*sort movements*/
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentaccount, !sorted);
  sorted = !sorted;
});

/*editing my app*/
createUserNames(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Display movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //.textContent = 0;

  // Sorting movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date"></div>
      <div class="movements__value">${mov} €</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => (acc += cur), 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// Calculate and display sum of deposits

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((mov, acc) => acc + mov);
  labelSumIn.textContent = `${income}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((mov, acc) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((int, acc) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Update UI

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};
//////////////////////////////////////////
// Calculating a username (using map method)

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
console.log(accounts);

/////////////////////////////////////////////

// Event handler

//Implementing login

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevents form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // clear login input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // update UI
    updateUI(currentAccount);
  }
});

console.log(account1.username);

// Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // clearing the fields
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
});
console.log(accounts);

// Loans

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
    // clear the input field
  }
  inputLoanAmount.value = '';
});

// Sorting the movements

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Closing the account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // deleting the account
    accounts.splice(index, 1);
    // Hiding UI
    containerApp.style.opacity = 0;
    // Clear the input fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

/////////////////////////////////////////
// Filtering deposits  and withdrawals from the movements array
/*
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
const arr = ['a', 'b', 'c', 'd'];
//arr.reverse();
console.log(arr.slice(2, 3));
console.log(arr);
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
*/
/////////////////////////////////////////////////
// FOR EACH
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  console.log(
    movement >= 0
      ? ` Movement ${i + 1}: Incoming amount of ${movement} `
      : ` Movement ${i + 1}: Outgoing amount of ${Math.abs(movement)}`
  );
}
*/
/*
console.log('----FOR EACH----');

movements.forEach(function (movement, i, array) {
  console.log(
    movement >= 0
      ? `Movement ${i + 1}: Incoming amount of ${movement} `
      : `Movement ${i + 1}: Outgoing amount of ${Math.abs(movement)}`
  );
});
*/
/////////////////////////////////////////////////
// FOR EACH with MAPS
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} : ${value}`);
});
*/

////////////////////////////////////////////////////
// MAP method
/*
const movements1 = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

const movements1USD = movements1.map(mov => mov * eurToUsd);
console.log(movements1USD);

const movementsDescriptions = movements1.map((mov, i) =>
  console.log(
    `Movement ${i + 1}: You ${
      mov > 0 ? 'deposited' : 'withdrew'
    } EUR ${Math.abs(mov)}`
  )
);
*/

/////////////////////////////////////////////////
// Reduce method - obtaining the general balance of an account

// console.log(movements);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration number ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// Arrow function
// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

//For of loop
// let balanceFor = 0;
// for (const mov of movements) {
//   balanceFor = balanceFor + mov;
//   console.log(balanceFor);
// }

// Reduce method - finding a maximum value
/*
console.log(movements);

const maximumAmount = movements.reduce(function (max, curr, i) {
  console.log(`Iteration ${i}: ${max}`);
  if (curr > max) {
    return curr;
  } else return max;
}, movements[0]);

console.log(maximumAmount);
*/

/////////////////////////////////////////////////
// Chaining methods
/*
const eurToUsd = 1.1;
const movements3 = [200, 450, -400, 3000, -650, -130, 70, 1300];

const depositsToUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((mov, acc) => acc + mov);
console.log(depositsToUSD);
*/
/////////////////////////////////////////////////
// Flat method
/*
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);
*/
/*
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);
*/
///////////////////////////////////////////////////
// Sort method

// Ascending order
//console.log(movements.sort((a, b) => a - b));

// Descending order
// console.log(movements.sort((a, b) => b - a));

///////////////////////////////////////////////////

// Creating and filling arrays

// const y = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(y);

// const z = Array.from(
//   { length: 100 },
//   (_, i) => Math.floor(Math.random() * 6) + 1
// );
// console.log(z);

// Creating an array from data stored in User Interface

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });

///////////////////////////////////////////////////////////
// Array methods Practice
//1.
// const bankDepositsSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositsSum);

//2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(numDeposits1000);

// const numDeposits1000red = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

// console.log(numDeposits1000red);

// 3. Calculating sums of deposits and sums of witdrawals, all in one go

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    {
      deposits: 0,
      withdrawals: 0,
    }
  );
console.log(deposits, withdrawals);

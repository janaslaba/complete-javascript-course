'use strict';

// const Person = function (firstName, birthYear) {
//   this.firstName = firstName;
//   this.birthYear = birthYear;
// };

// Person.prototype.calcAge = function () {
//   console.log(2037 - this.birthYear);
// };

// const jonas = new Person('Jonas', 1991);
// const matilda = new Person('Matilda', 1998);

// console.log(jonas instanceof Person);

// jonas.calcAge();
// matilda.calcAge();

// Person.prototype.species = 'Homo Sapiens';
// console.log(jonas.species, matilda.species);

// console.log(jonas.__proto__);
// console.log(Person.prototype.isPrototypeOf(Person));

////////////////////////////////////////////////////////////
// Inheritance between classes

// const Person = function (firstName, birthYear) {
//   this.firstName = firstName;
//   this.birthYear = birthYear;
// };

// Person.prototype.calcAge = function () {
//   console.log(2037 - this.birthYear);
// };

// const Student = function (firstName, birthYear, course) {
//   Person.call(this, firstName, birthYear);
//   this.course = course;
// };

// // Linking prototypes
// Student.prototype = Object.create(Person.prototype); // creates an emty array

// Student.prototype.constructor = Student;
// console.log(Student);

// const mike = new Student('Mike', 2002, 'Computer Science');

// mike.calcAge();

/////////////////////////////////////////
// Inheritance between "classes": Object.create
/*
const PersonProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },
  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

const steven = Object.create(PersonProto);
steven.init('Steven', 2010);

// Linking two prototypes together
const StudentProto = Object.create(PersonProto);

StudentProto.init = function (firstName, birthYear, course) {
  PersonProto.init.call(this, firstName, birthYear);
  this.course = course;
};

StudentProto.introduce = function () {
  console.log(`Hello, I'm ${this.firstName} and I study ${this.course}.`);
};

const jay = Object.create(StudentProto);

jay.init('Jay', 2010, 'Computer Science');
jay.introduce();
jay.calcAge();
*/
/////////////////////////////////////////////////////

const bcrypt = require('bcrypt');

const password = 'password2';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Хеш пароля', hash);
});


const password1 = 'password1';
const hash = '$2b$10$V9So4EKwohSv5QL3saMvL.Zr3lWjP7AadDvcJl/DtWix4KGZbexyO';

bcrypt.compare(password1, hash.trim()).then(match => {
  console.log('Совпадение:', match);
});


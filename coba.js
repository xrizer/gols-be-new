const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '123456';
const someOtherPlaintextPassword = 'not_bacon';

const printtt = (hash) => {
    console.log(hash);
}

function hashPassword(saltRounds, myPlaintextPassword) {

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            printtt(hash);
        });
    });
}

hashPassword(saltRounds, myPlaintextPassword);
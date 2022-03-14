const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const getAuth = (authHeader) => {
  return jwt.verify(authHeader, process.env.JWT_KEY, {algorithms: [process.env.ALGORITHMS]}, (err, data) => {
    // console.log('User menggunakan aplikasi');
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};

const setToken = (data) => {
  return jwt.sign(data, process.env.JWT_KEY, {

    algorithm: process.env.ALGORITHMS,
    expiresIn: '8h',

  });
};


module.exports = {
  getAuth,
  setToken,
};
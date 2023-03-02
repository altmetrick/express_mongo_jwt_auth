const bcrypt = require('bcrypt');
const path = require('path');

const usersDB = {
  users: require('../models/users.json'),
  setUsers(data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: 'User name and password must be provided!' });
  }

  //find a user
  const user = usersDB.users.find((u) => u.userName === userName);
  console.log('user login', user);
  if (!user) {
    return res
      .status(404)
      .json({ message: `Provided wrong email or password` });
  }
  //evaluate provided password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: 'Provided wrong email or password' });
  }

  if (isValidPassword) {
    //creating JWT token and sending it to client
    res.json({ message: `${userName} is logged in` });
  }
};

module.exports = { handleLogin };

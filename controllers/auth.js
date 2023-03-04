const bcrypt = require('bcrypt');
const path = require('path');
const fsPromises = require('fs').promises;
const jwt = require('jsonwebtoken');

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

  //find a user in db
  const foundUser = usersDB.users.find((u) => u.userName === userName);
  if (!foundUser) {
    return res
      .status(404)
      .json({ message: `Provided wrong email or password` });
  }
  //evaluate provided password
  const isValidPassword = await bcrypt.compare(password, foundUser.password);

  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: 'Provided wrong email or password' });
  }

  if (isValidPassword) {
    //creating JWT tokens and sending it to client
    const accessToken = jwt.sign(
      { userName: foundUser.userName, userId: foundUser.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      { userName: foundUser.userName, userId: foundUser.userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    //Saving Refresh Token in db (with current user)
    const otherUsers = usersDB.users.filter(
      (u) => u.userId !== foundUser.userId
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    //Sending tokens
    //as we use cookie parser, now we have ability to add cookie on res
    //set secure: false while development
    // secure : true - will be sent only on https, and local host is just http, so it won't work
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: false,
    });

    res.json({ message: `${userName} is logged in`, accessToken });
  }
};

module.exports = { handleLogin };

const path = require('path');
const fsPromises = require('fs').promises;
const jwt = require('jsonwebtoken');

const usersDB = {
  users: require('../models/users.json'),
  setUsers(data) {
    this.users = data;
  },
};

const handleLogOut = async (req, res) => {
  //Also delete access token on client
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.send(204).json({ message: 'logout success' });

  const refreshToken = cookies.jwt;
  //search for the session (user) in db
  const foundUser = usersDB.users.find((u) => u.refreshToken === refreshToken);
  if (!foundUser) {
    //if there is no session (user with refresh token) just delete cookie
    res.clearCookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: false,
    });
    return res.sendStatus(204);
  }
  //if there is a session (user) delete it in the db
  const otherUsers = usersDB.users.filter(
    (u) => u.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'models', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  //also delete cookie
  res.clearCookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'None',
    secure: false,
  });
  return res
    .status(200)
    .json({ message: `User ${foundUser.userName} logged out` });
};

module.exports = { handleLogOut };

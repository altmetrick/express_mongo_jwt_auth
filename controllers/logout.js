const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleLogOut = async (req, res) => {
  //Also delete access token on client
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.send(204).json({ message: 'logout success' });

  const refreshToken = cookies.jwt;

  //search for the session (user) in db
  const foundUser = await User.findOne({ refreshToken });
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
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

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

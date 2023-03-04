const jwt = require('jsonwebtoken');

const usersDB = {
  users: require('../models/users.json'),
  setUsers(data) {
    this.users = data;
  },
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  //search for user's session (or user with refresh token) in db by refreshToken
  const foundUser = usersDB.users.find((u) => {
    return u.refreshToken === refreshToken;
  });
  //verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.userName !== foundUser.userName) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    //create new access token
    const payload = {
      userName: decoded.userName,
      userId: decoded.userId,
    };
    const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s',
    });

    res.json({ accessToken: newAccessToken });
  });
};

module.exports = { handleRefreshToken };

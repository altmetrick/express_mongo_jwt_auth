const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  //retrieving old refreshToken from users request
  const refreshToken = cookies.jwt;
  //then deleting it in cookies, so client wont get it
  res.clearCookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'None',
    secure: false,
  });

  //search for user's session (or user with refresh token) in db by refreshToken
  const foundUser = await User.findOne({ refreshToken }).exec();
  // if !foundUser - we didn't found the refreshToken in the db,
  // so that means that this token is being reused

  // Detection of refresh token reuse
  if (!foundUser) {
    //When refresh token is reused, we need to decode that token
    //and pull out the  userName (from tokens payload),
    //then find user by that name (decoded.userName) and clear all of their refresh tokens
    //so that account will be forced to log-in again
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);

        const hackedUser = await User.findOne({
          userName: decoded.userName,
        }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    return res.sendStatus(403); // Forbidden
  }

  //Refresh token rotation - removing old refT and creating a new one
  //filtering out the old refT (deleting old refT from db)
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rft) => rft !== refreshToken
  );
  //verify refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || decoded.userName !== foundUser.userName) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      //Create a new Refresh Token
      const newRefreshToken = jwt.sign(
        { userName: foundUser.userName, userId: foundUser.userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      //Saving new Refresh Token in db (with current user)
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      console.log(result);

      //Saving new Refresh Token in cookie
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'None',
        secure: false,
      });

      //Create new access token
      const payload = {
        userInfo: {
          userName: foundUser.userName,
          roles: Object.values(foundUser.roles),
        },
      };
      const newAccessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 60 * 5 }
      );
      //CHANGE expiresIn: ON PRODUCTION!!!

      res.json({ accessToken: newAccessToken });
    }
  );
};

module.exports = { handleRefreshToken };

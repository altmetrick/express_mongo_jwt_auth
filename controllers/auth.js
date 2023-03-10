const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleLogin = async (req, res) => {
  const cookies = req.cookies;

  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: 'User name and password must be provided!' });
  }

  //find current user in db
  const foundUser = await User.findOne({ userName }).exec();
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
    //we need to specify roles in tokens payload
    //as aur roles is object 'role': numericValue in payload we can provide only arr values
    const rolesValues = Object.values(foundUser.roles);

    //creating JWT tokens and sending it to the client
    const accessToken = jwt.sign(
      {
        userInfo: {
          userName: foundUser.userName,
          userId: foundUser.userId,
          roles: rolesValues,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );
    //CHANGE expiresIn: ON PRODUCTION!!!

    //Creating new refresh token
    const newRefreshToken = jwt.sign(
      { userName: foundUser.userName, userId: foundUser.userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    //We need to check is there a refresh token (old token) in cookie
    //if so we need to remove that refT from db and cookie
    const newRefreshTokenArray = !cookies.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((refT) => refT !== cookies.jwt);

    if (cookies?.jwt) {
      res.clearCookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: false,
      });
    }

    //Saving new Refresh Token in db (with current user)
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);

    //Sending tokens
    //as we use cookie parser, now we have ability to add cookie on res
    //set secure: false while development
    // secure : true - will be sent only on https, and local host is just http, so it won't work
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'None',
      secure: false,
    });

    res.json({ message: `${userName} is logged in`, accessToken });
  }
};

module.exports = { handleLogin };

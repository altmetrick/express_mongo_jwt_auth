const bcrypt = require('bcrypt');

const User = require('../models/User');
const ROLES_LIST = require('../config/roles-list');

const registerUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: 'User name and password must be provided!' });
  }

  //search for duplicate
  const duplicate = await User.findOne({ userName }).exec();
  if (duplicate) {
    //409 - conflict
    return res
      .status(409)
      .json({ message: `User with name ${userName} already exists` });
  }
  try {
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create and store a new user in the DB
    const newUser = await User.create({
      userName,
      password: hashedPassword,
      // roles: {
      //   //user: ROLES_LIST['user'], - default value
      //   //editor: ROLES_LIST['editor'],
      //   //admin: ROLES_LIST['admin'],
      // },
    });

    res.status(201).json({ user: newUser, message: 'User was registered.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser };

const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const path = require('path');

const usersDB = {
  users: require('../models/users.json'),
  setUsers(data) {
    this.users = data;
  },
};

const registerUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: 'User name and password must be provided!' });
  }

  //search for duplicate
  const duplicate = usersDB.users.find((user) => user.userName === userName);
  if (duplicate) {
    res
      .status(409)
      .json({ message: `User with name ${userName} already exists` });
  }
  try {
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //store the new user
    const newUser = { userName, password: hashedPassword };
    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    console.log(usersDB.users);
    res.status(201).json({ user: newUser, message: 'User was registered.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser };

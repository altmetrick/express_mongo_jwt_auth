const User = require('../models/User');

const asyncWrapper = require('../middleware/async-wrapper');
const { json } = require('express');

//createUser - users is creating on /register

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({});
  if (!users) {
    return res.status(204).json({ message: 'No users found.' });
  }

  res.status(200).json({ users });
});

const getUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).exec();
  if (!user) {
    return res
      .status(404)
      .json({ message: `User with id ${id} does not exist` });
  }

  res.status(200).json({ user });
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: 'User name must be provided' });
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    { userName },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res
      .status(404)
      .json({ message: `User with id ${id} does not exist!` });
  }

  res.status(200).json({ user, message: 'User is updated' });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return res
      .status(404)
      .json({ message: `User with id ${id} does not exist!` });
  }

  res.status(200).json({ user, message: `User with id ${id} was deleted.` });
});

module.exports = { getAllUsers, getUser, updateUser, deleteUser };

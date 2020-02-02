/* eslint-disable no-console */
import express from 'express';
import CryptoHelper from '../helpers/crypto-helper';
import { UserModel } from '../models/users';


export const usersRouter = express.Router();
const jobTitles = ['Front End Developer', 'Full Stack Developer', 'Marketing', 'DBA', 'Back End Developer', 'Architect'];

// This should be change to GET instead of post
usersRouter.post('/', async (req, res) => {
  try {
    const usersData = await UserModel.find();
    const usersResponse = [];
    for (let i = 0; i < usersData.length; i += 1) {
      const userData = usersData[i];
      usersResponse.push({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        jobTitle: jobTitles[i % jobTitles.length],
        imageUrl: `https://bootdey.com/img/Content/avatar/avatar${(i % 7) + 1}.png`,
      });
    }
    res.status(200).json(usersResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

usersRouter.post('/register', async (req, res) => {
  try {
    const existUsers = await UserModel.find({ userName: req.body.userName });
    if (existUsers.length > 0) {
      console.log('Users exists!');
      return res.status(200).json({ status: 'User exists' });
    }

    const hashedPassword = CryptoHelper.HashString(req.body.password);

    const newUser = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      password: hashedPassword,
    });
    const createdUser = await newUser.save();
    return res.status(200).json({ status: 'ok', user: createdUser });
  } catch (err) {
    return res.status(400).json({ error: 'Registration failed' });
  }
});

/* eslint-disable no-console */
import express from 'express';
import CryptoHelper from '../helpers/crypto-helper';
import { UserModel } from '../models/users';

export const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { userName } = req.body;
    const requestHashedPassword = CryptoHelper.HashString(req.body.password);

    const users = await UserModel.find({
      userName,
      password: requestHashedPassword,
    });

    if (users.length > 0) {
      const jwtToken = CryptoHelper.CreateJwtToken(userName);
      return res.status(200).json({
        status: 'ok',
        user: users[0],
        jwt: jwtToken,
      });
    }
    return res.status(400).json({ status: 'bad' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post('/logout', async (req, res) => {
  console.log('logging out');
  const response = { logout: 'logout success' };
  res.json(response);
});

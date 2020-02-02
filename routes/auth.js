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
    return res.status(403).json({ error: 'Incorrect username and password' });
  } catch (err) {
    return res.status(400).json({ error: 'Authentication failed' });
  }
});

// Not in use
authRouter.post('/logout', async (req, res) => {
  console.log('logging out');
  const response = { logout: 'logout success' };
  res.json(response);
});

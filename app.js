/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { usersRouter } from './routes/users';
import { authRouter } from './routes/auth';
import { global } from './middlewares/global';

dotenv.config();
const app = express();
const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL;

// Connecting to local MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => { console.error(error); });
db.once('open', () => console.log('Connected to Database'));


app.use(express.json());
app.use(express.urlencoded());
app.use(global.authenticateRequest); // Authntication all requests (except login and register).

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

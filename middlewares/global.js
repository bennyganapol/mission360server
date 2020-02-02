/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import CryptoHelper from '../helpers/crypto-helper';

const tokenLengthSeconds = 3600; // Hour
const excludeList = ['/auth/login', '/users/register'];

export const global = {
  authenticateRequest: (req, res, next) => {
    // we dont check authentication if request is excluded
    if (excludeList.includes(req.path)) { return next(); }

    try {
      if (req.headers.authorization && req.headers.authorization.includes('Bearer ')) {
        const jwtHeader = req.headers.authorization.replace('Bearer ', '');
        const jwt = CryptoHelper.GetJsonFromJwtToken(jwtHeader);
        const tokenCreatedDate = new Date(Date.parse(jwt.timeCreated));
        const tokenExpiration = new Date(tokenCreatedDate.getTime() + (tokenLengthSeconds * 1000));
        if (Date.now() > tokenExpiration) {
          console.warn('JWT expired');
          return res.status(500).json({ message: 'Token expired' });
        }
        req.data = { userName: jwt.userName };
      } else {
        return res.status(500).json({ message: 'No Token' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Authentication error' });
    }


    return next();
  },
};

import * as jwt from 'jsonwebtoken';


export function getUser(token: string, secret: string) { 
    try {
      const decoded = jwt.verify(token, secret, {});
      return decoded;

    } catch (err) {
      //TODO: No token
    }
  return {};

};


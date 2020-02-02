import crypto from 'crypto';

const AES_ALGORITHM = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Should be created and stored(multiple servers will break)
const iv = crypto.randomBytes(16);

class CryptoHelper {
  static HashString(stringToHash) {
    const hashKey = process.env.PASSWORD_HASH_KEY;
    const hash = crypto.createHmac('sha512', hashKey);
    hash.update(stringToHash);
    const value = hash.digest('hex');
    return value;
  }

  static CreateJwtToken(userName) {
    const jsonToken = {
      userName,
      timeCreated: new Date(new Date().toUTCString()),
    };

    const jwtToken = this.encrypt(JSON.stringify(jsonToken));
    return jwtToken;
  }

  static GetJsonFromJwtToken(jwtToken) {
    const jsonToken = JSON.parse(this.decrypt(jwtToken));
    return jsonToken;
  }


  static encrypt(text) {
    const cipher = crypto.createCipheriv(AES_ALGORITHM, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  }

  static decrypt(text) {
    const encryptedJson = JSON.parse(text);
    const currentIv = Buffer.from(encryptedJson.iv, 'hex');
    const encryptedText = Buffer.from(encryptedJson.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(AES_ALGORITHM, Buffer.from(key), currentIv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export default CryptoHelper;

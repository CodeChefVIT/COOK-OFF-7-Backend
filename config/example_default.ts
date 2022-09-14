// Make a new file with name default.ts and put in your credentials
// Generate keys from https://travistidwell.com/jsencrypt/demo/

export default {
  port: "YOUR_PORT",
  dbUri: "MONGOT_URI",
  saltWorkFactor: "YOUR_SALT_WORK_FACTOR",
  accessTokenTtl: "YOUR_ACCESS_TOKEN_TTL",
  refreshTokenTtl: "YOUR_REFRESH_TOKEN_TTL",
  publicKey: `-----BEGIN PUBLIC KEY-----
  YOUR_PUBLIC_KEY
  -----END PUBLIC KEY-----
  `,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
  YOUR_PRIVATE_KEY
  -----END RSA PRIVATE KEY-----`,
};

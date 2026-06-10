import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const tenantId = process.env.AZURE_TENANT_ID || '005f7837-0d29-4d25-983d-4eb8674e2714';

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid!, (err, key) => {
    if (err) return callback(err);
    callback(null, key?.getPublicKey());
  });
}

export interface TokenPayload {
  oid: string;
  name?: string;
  preferred_username?: string;
  tid?: string;
}

export function validateToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        audience: process.env.AZURE_CLIENT_ID || 'dd3bcdf6-5593-4e0b-9c25-94e8d874aac0',
        issuer: [
          `https://login.microsoftonline.com/${tenantId}/v2.0`,
          `https://sts.windows.net/${tenantId}/`,
        ],
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as TokenPayload);
      }
    );
  });
}

import { createCipheriv, createDecipheriv, randomBytes, CipherKey } from 'crypto';

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET 
  ? Buffer.from(process.env.ENCRYPTION_SECRET, 'hex') 
  : randomBytes(32);

interface EncryptedCredentials {
  encryptedToken: string;
  iv: string;
  authTag: string;
}

export class TokenManager {
  private readonly key: Uint8Array;
  private readonly algorithm = ENCRYPTION_ALGORITHM;

  constructor(secretKey: string) {
    // Ensure the key is exactly 32 bytes for AES-256
    const keyBuffer = Buffer.from(secretKey.padEnd(32, '0').slice(0, 32));
    this.key = new Uint8Array(keyBuffer);
  }

  static encrypt(data: string): EncryptedCredentials {
    try {
      const tokenManager = new TokenManager(ENCRYPTION_KEY.toString('hex'));
      const iv = randomBytes(IV_LENGTH);
      
      // Convert key to Uint8Array
      const key: CipherKey = Uint8Array.from(ENCRYPTION_KEY);
      
      const cipher = createCipheriv(
        ENCRYPTION_ALGORITHM, 
        key, 
        iv
      );

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();

      return {
        encryptedToken: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Token encryption failed');
    }
  }

  static decrypt(credentials: EncryptedCredentials): string {
    try {
      const key: CipherKey = Uint8Array.from(ENCRYPTION_KEY);
      const iv = Buffer.from(credentials.iv, 'hex');
      
      const decipher = createDecipheriv(
        ENCRYPTION_ALGORITHM, 
        key, 
        iv
      );
      
      decipher.setAuthTag(Buffer.from(credentials.authTag, 'hex'));

      let decrypted = decipher.update(credentials.encryptedToken, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Token decryption failed');
    }
  }

  // Method to store Shopify credentials
  storeShopifyCredentials(shopDomain: string, accessToken: string): EncryptedCredentials {
    const combinedCredentials = `${shopDomain}:${accessToken}`;
    
    // Encrypt credentials
    return TokenManager.encrypt(combinedCredentials);
  }

  // Method to retrieve Shopify credentials
  static retrieveShopifyCredentials(
    encryptedCredentials: EncryptedCredentials
  ): { shopDomain: string; accessToken: string } {
    try {
      const decryptedCredentials = TokenManager.decrypt(encryptedCredentials);
      const [shopDomain, accessToken] = decryptedCredentials.split(':');

      return { shopDomain, accessToken };
    } catch (error) {
      console.error('Retrieval error:', error);
      throw new Error('Unable to retrieve store credentials');
    }
  }
}

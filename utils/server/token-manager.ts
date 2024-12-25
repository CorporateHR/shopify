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

  // Method to retrieve all stored Shopify credentials
  static async getStoredCredentials(): Promise<Array<{
    storeUrl: string;
    accessToken: string;
    storeName?: string;
    storeInfo?: any;
    productsCount?: number;
    ordersCount?: number;
    connectedAt?: string;
  }>> {
    try {
      const storedCredentialsStr = process.env.STORED_SHOPIFY_CREDENTIALS;
      
      if (!storedCredentialsStr) {
        return []; // No stored credentials
      }

      // Parse stored credentials
      const storedCredentials = JSON.parse(storedCredentialsStr);
      
      return storedCredentials.map((cred: EncryptedCredentials) => {
        try {
          const decryptedCredentials = this.decrypt(cred);
          const parsedCredentials = JSON.parse(decryptedCredentials);
          return parsedCredentials;
        } catch (error) {
          console.error('Error decrypting credentials:', error);
          return null;
        }
      }).filter(Boolean); // Remove any failed decryptions
    } catch (error) {
      console.error('Error retrieving stored credentials:', error);
      return [];
    }
  }

  // Add method to save store connection details
  static async saveStoreConnection(storeDetails: {
    storeUrl: string;
    accessToken: string;
    storeName?: string;
    storeInfo?: any;
    productsCount?: number;
    ordersCount?: number;
    connectedAt?: string;
  }): Promise<void> {
    try {
      // Encrypt the credentials
      const encryptedCredentials = this.encrypt(
        JSON.stringify({
          storeUrl: storeDetails.storeUrl,
          accessToken: storeDetails.accessToken
        })
      );

      // Retrieve existing stored credentials
      const storedCredentialsStr = process.env.STORED_SHOPIFY_CREDENTIALS || '[]';
      const storedCredentials = JSON.parse(storedCredentialsStr);

      // Check if store already exists to avoid duplicates
      const existingStoreIndex = storedCredentials.findIndex(
        (cred: any) => {
          const decryptedCred = this.decrypt(cred);
          const parsedCred = JSON.parse(decryptedCred);
          return parsedCred.storeUrl === storeDetails.storeUrl;
        }
      );

      // Add or update store credentials
      if (existingStoreIndex !== -1) {
        storedCredentials[existingStoreIndex] = encryptedCredentials;
      } else {
        storedCredentials.push(encryptedCredentials);
      }

      // Update environment variable (Note: this is a simplification and not secure for production)
      process.env.STORED_SHOPIFY_CREDENTIALS = JSON.stringify(storedCredentials);

      // In a real-world scenario, you'd store this in a secure database
      console.log('Store connection saved successfully');
    } catch (error) {
      console.error('Error saving store connection:', error);
      throw new Error('Failed to save store connection');
    }
  }
}

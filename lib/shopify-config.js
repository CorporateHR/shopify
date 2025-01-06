import { env } from 'process';
import fs from 'fs';
import path from 'path';

export function getShopifyCredentials() {
  // Check environment variables
  const shopDomain = env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN;
  const accessToken = env.SHOPIFY_ACCESS_TOKEN;
  const apiKey = env.SHOPIFY_API_KEY;
  const apiSecret = env.SHOPIFY_API_SECRET;

  // Enhanced logging for debugging
  console.log('Checking Shopify Credentials:');
  console.log('Shop Domain:', shopDomain ? '✓ Set' : '✗ Missing');
  console.log('Access Token:', accessToken ? '✓ Set' : '✗ Missing');
  console.log('API Key:', apiKey ? '✓ Set' : '✗ Missing');
  console.log('API Secret:', apiSecret ? '✓ Set' : '✗ Missing');

  // Check .env file directly if environment variables are not set
  if (!shopDomain || !accessToken || !apiKey || !apiSecret) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContents = fs.readFileSync(envPath, 'utf8');
        console.log('Attempting to read .env file manually');
        
        const envVars = {};
        envContents.split('\n').forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            envVars[key.trim()] = value.trim();
          }
        });

        // Validate and log manual .env parsing
        console.log('Manually parsed .env variables:', Object.keys(envVars));
      } else {
        console.error('No .env file found at:', envPath);
      }
    } catch (error) {
      console.error('Error reading .env file:', error.message);
    }

    throw new Error(`
      ❌ Shopify Credentials Configuration Error ❌
      
      Please configure your Shopify store credentials:
      1. Set environment variables, OR
      2. Create a .env file with the following:
         - NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN
         - SHOPIFY_ACCESS_TOKEN
         - SHOPIFY_API_KEY
         - SHOPIFY_API_SECRET

      Refer to .env.example for guidance.
    `);
  }

  return {
    shopDomain,
    accessToken,
    apiKey,
    apiSecret,
    scopes: env.SHOPIFY_SCOPES?.split(',') || ['read_products', 'write_products']
  };
}

export function validateShopifyConfiguration() {
  try {
    const credentials = getShopifyCredentials();
    console.log('✅ Shopify credentials validated successfully.');
    return credentials;
  } catch (error) {
    console.error('❌ Shopify configuration validation failed:', error.message);
    throw error;
  }
}

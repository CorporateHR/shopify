'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createShopifyConnection } from '@/utils/shopify-connection';
import { useToast } from '@/components/ui/use-toast';
import { TokenManager } from '@/utils/server/token-manager';

export function ShopifyStoreConnectionForm() {
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnection = async () => {
    // Validate inputs
    if (!shopDomain || !accessToken) {
      toast({
        title: 'Connection Failed: Please provide both Shop Domain and Access Token',
        variant: 'destructive'
      });
      return;
    }

    // Validate shop domain format
    const domainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
    if (!domainRegex.test(shopDomain)) {
      toast({
        title: 'Invalid Shop Domain: Please enter a valid Shopify store domain (e.g., your-store.myshopify.com)',
        variant: 'destructive'
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Attempt to create connection
      const connection = createShopifyConnection(shopDomain, accessToken);
      const isConnected = await connection.testConnection();

      if (isConnected) {
        // Encrypt and securely store credentials
        const encryptedCredentials = await TokenManager.storeShopifyCredentials(
          shopDomain, 
          accessToken
        );

        // Store encrypted credentials (could be in a secure database)
        localStorage.setItem(
          'shopify_encrypted_credentials', 
          JSON.stringify(encryptedCredentials)
        );

        toast({
          title: 'Connection Successful: Connected to Shopify store securely',
          variant: 'default'
        });

        // Optional: Trigger next steps or UI updates
      } else {
        toast({
          title: 'Connection Failed: Unable to connect to Shopify store. Check your credentials.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';

      toast({
        title: `Connection Error: ${errorMessage}`,
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Shopify Store</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="shopDomain">Shop Domain</Label>
            <Input
              id="shopDomain"
              placeholder="your-store.myshopify.com"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value.trim())}
            />
          </div>
          
          <div>
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="Shopify Access Token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value.trim())}
            />
          </div>

          <Button 
            onClick={handleConnection} 
            className="w-full"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect to Shopify'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

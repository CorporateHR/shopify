'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createShopifyConnection } from '@/utils/shopify-connection';
import { useToast } from '@/components/ui/use-toast';
import { TokenManager } from '@/utils/server/token-manager';
import { useRouter } from 'next/navigation';

export function ShopifyStoreConnectionForm() {
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
        const tokenManager = new TokenManager(process.env.ENCRYPTION_SECRET || '');
        tokenManager.storeShopifyCredentials(shopDomain, accessToken);

        toast({
          title: 'Store Connected Successfully',
          description: `Connected to ${shopDomain}`,
          variant: 'default'
        });

        // Redirect to dashboard or store management page
        router.push('/dashboard');
      } else {
        toast({
          title: 'Connection Failed',
          description: 'Unable to verify store credentials. Please check your domain and access token.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Store connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'An unexpected error occurred while connecting to the store.',
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
              onChange={(e) => setShopDomain(e.target.value)}
              disabled={isConnecting}
            />
          </div>
          <div>
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="Enter your Shopify access token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              disabled={isConnecting}
            />
          </div>
          <Button 
            onClick={handleConnection} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect Store'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

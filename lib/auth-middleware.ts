import { NextRequest, NextResponse } from 'next/server';

export function authMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Check for Shopify store credentials
    const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!shopDomain || !accessToken) {
      return NextResponse.json({ 
        error: 'Shopify store credentials are not configured' 
      }, { status: 401 });
    }

    // Proceed with the original handler
    return handler(req);
  };
}

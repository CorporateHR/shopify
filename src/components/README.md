# Store Connection Form

## Overview
This component provides a secure and user-friendly form for connecting a Shopify store to our application.

## Features
- Robust form validation using Zod
- Client-side and server-side validation
- Secure password input
- Error handling
- Responsive design with Tailwind CSS

## Dependencies
- React Hook Form
- Zod
- Tailwind CSS

## Usage
Import and use the `StoreConnectionForm` component in your page:

```typescript
import StoreConnectionForm from './StoreConnectionForm';

function ConnectStorePage() {
  return <StoreConnectionForm />;
}
```

## Security Considerations
- API keys and secrets are not stored in client-side state
- Form uses server-side validation
- Passwords are masked

## Next Steps
- Implement actual Shopify API connection logic
- Add more robust error handling
- Consider adding OAuth flow for Shopify store connection

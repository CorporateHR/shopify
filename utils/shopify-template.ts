// Shopify Product CSV Template
export const SHOPIFY_PRODUCT_TEMPLATE = `Handle,Title,Body (HTML),Vendor,Product Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Price,Variant Compare At Price,Variant Weight,Variant Inventory Tracker,Variant Inventory Qty,Variant Fulfillment Service,Variant Requires Shipping,Variant Taxable,Image Src,Image Alt Text,Gift Card,SEO Title,SEO Description`;

// Function to convert template to array of headers
export const getShopifyTemplateHeaders = (): string[] => {
  return SHOPIFY_PRODUCT_TEMPLATE.split(',').map(header => header.trim());
};

// Function to convert uploaded data to match Shopify template
export const mapToShopifyTemplate = (
  uploadedData: Record<string, any>[], 
  headerMappings: Record<string, string>
): Record<string, any>[] => {
  const shopifyHeaders = getShopifyTemplateHeaders();
  
  return uploadedData.map(row => {
    const mappedRow: Record<string, any> = {};
    
    shopifyHeaders.forEach(shopifyHeader => {
      // Find the original header that maps to this Shopify header
      const originalHeader = Object.keys(headerMappings).find(
        key => headerMappings[key] === shopifyHeader
      );
      
      // If a mapping exists, use the value from the original row
      if (originalHeader && row[originalHeader]) {
        mappedRow[shopifyHeader] = row[originalHeader];
      } else {
        // If no mapping, set to empty string or default value
        mappedRow[shopifyHeader] = '';
      }
    });
    
    return mappedRow;
  });
};

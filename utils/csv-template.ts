// Predefined template content 
export const DEFAULT_TEMPLATE = `Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status
example-t-shirt,Example T-Shirt,,Acme,Apparel & Accessories > Clothing,Shirts,mens t-shirt example,TRUE,Title,"Lithograph - Height: 9"" x Width: 12""",,,,,,3629,,,deny,manual,25,,TRUE,TRUE,,https://burst.shopifycdn.com/photos/green-t-shirt.jpg?width=5000,1,,FALSE,Our awesome T-shirt in 70 characters or less.,A great description of your products in 320 characters or less,Apparel & Accessories > Clothing,Unisex,Adult,7X8ABC910,T-shirts,"cotton, pre-shrunk",used,FALSE,,,,,,,g,,,,,active
example-t-shirt,,,,,,,,,Small,,,,,example-shirt-s,200,,,deny,manual,19.99,24.99,TRUE,TRUE,,,,,,,,,,,,,,,,,,,,,,g,,,,,
example-t-shirt,,,,,,,,,Medium,,,,,example-shirt-m,200,shopify,,deny,manual,19.99,24.99,TRUE,TRUE,,,,,,,,,,,,,,,,,,,,,,g,,,,,
example-pants,Example Pants,,Acme,Apparel & Accessories > Clothing,Pants,mens pants example,FALSE,Title,"Jeans, W32H34",,,,,,1250,,,deny,manual,49.99,57.99,TRUE,TRUE,,https://burst.shopifycdn.com/photos/distressed-kids-jeans.jpg?width=5000,1,,FALSE,Our awesome Pants in 70 characters or less.,A great description of your products in 320 characters or less,Apparel & Accessories > Clothing,Unisex,Adult,7Y2ABD712,Pants,"cotton, pre-shrunk",used,FALSE,,,,,,,g,,,,,draft
example-hat,Example Hat,,Acme,Apparel & Accessories > Clothing,Hat,mens hat example,FALSE,Title,Grey,,,,,,275,,,deny,manual,17.99,22.99,TRUE,TRUE,,https://burst.shopifycdn.com/photos/kids-beanie.jpg?width=5000,1,,FALSE,Our awesome Hat in 70 characters or less.,A great description of your products in 320 characters or less,Apparel & Accessories > Clothing,Unisex,Adult,5P1NBQ314,Hat,"cotton, pre-shrunk",used,FALSE,,,,,,,g,,,,,archived`;

/**
 * Generate a CSV template for Shopify product imports
 * @param customData Optional custom data to replace in the template
 */
export function generateShopifyProductCSVTemplate(
  customData?: Partial<Record<string, string>>
): string {
  try {
    // Use the default template
    const baseTemplate = DEFAULT_TEMPLATE;
    
    // If custom data is provided, replace values in the template
    if (customData && Object.keys(customData).length > 0) {
      const lines = baseTemplate.split('\n');
      const headerLine = lines[0];
      const dataLines = lines.slice(1);
      
      const updatedDataLines = dataLines.map(line => {
        const values = line.split(',');
        Object.entries(customData).forEach(([key, value]) => {
          const headerIndex = headerLine.split(',').indexOf(key);
          if (headerIndex !== -1) {
            values[headerIndex] = value || values[headerIndex];
          }
        });
        return values.join(',');
      });
      
      return [headerLine, ...updatedDataLines].join('\n');
    }
    
    return baseTemplate;
  } catch (error) {
    console.error('Error generating CSV template:', error);
    return DEFAULT_TEMPLATE;
  }
}

/**
 * Download CSV template as a file
 * @param filename Optional filename for the CSV template
 * @param customData Optional custom data to replace in the template
 */
export function downloadShopifyProductCSVTemplate(
  filename = 'shopify-product-template.csv', 
  customData?: Partial<Record<string, string>>
) {
  // Create blob from CSV content
  const csvContent = generateShopifyProductCSVTemplate(customData);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

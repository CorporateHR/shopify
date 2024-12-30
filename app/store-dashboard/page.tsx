"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart, 
  Settings, 
  CreditCard, 
  Truck, 
  Globe, 
  FileText, 
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Define interfaces for different data types
interface StoreMetrics {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  inventory: number;
}

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
}

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  sku: z.string().min(1, 'SKU is required'),
  vendor: z.string().optional(),
  quantity: z.string().regex(/^\d+$/, 'Quantity must be a whole number'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function StoreDashboardPage({ 
  store
}: { 
  store?: any
}) {
  const [activeStore, setActiveStore] = useState<any>(null);
  const [metrics, setMetrics] = useState<StoreMetrics>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateProductDrawerOpen, setIsCreateProductDrawerOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      sku: '',
      vendor: '',
      quantity: '',
    },
  });

  const onSubmitProduct = async (data: ProductFormValues) => {
    try {
      const response = await fetch('/api/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const newProduct = await response.json();
      
      // Update local state
      setProducts(prevProducts => [...prevProducts, newProduct]);
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        totalProducts: prevMetrics.totalProducts + 1
      }));

      toast({
        title: `Product "${data.title}" has been successfully added.`,
        variant: 'default'
      });

      // Close drawer and reset form
      setIsCreateProductDrawerOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: error instanceof Error 
          ? error.message 
          : 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Fetch store metrics
        const metricsResponse = await fetch('/api/store-metrics');
        const metricsData = await metricsResponse.json();
        
        // Check if the response is successful
        if (metricsData.error) {
          throw new Error(metricsData.error);
        }
        
        setMetrics(metricsData);

        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Fetch orders
        const ordersResponse = await fetch('/api/orders');
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        // Fetch customers
        const customersResponse = await fetch('/api/customers');
        const customersData = await customersResponse.json();
        setCustomers(customersData);
      } catch (error) {
        toast({
          title: "Data Fetch Error",
          variant: "destructive"
        });
        console.error('Failed to fetch store data:', error);
      }
    };

    fetchStoreData();
  }, []);

  return (
    <div className="p-4 relative h-full bg-[#121212] text-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#C0C0C0]">Total Products</CardTitle>
            <Package className="h-4 w-4 text-[#00A6B2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#EAEAEA]">{metrics.totalProducts}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#C0C0C0]">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#00A6B2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#EAEAEA]">{metrics.totalOrders}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#C0C0C0]">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-[#00A6B2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#EAEAEA]">{metrics.totalCustomers}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#C0C0C0]">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#00A6B2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#EAEAEA]">
              ${metrics?.totalRevenue?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className="bg-[#121212]" defaultValue="products">
        <TabsList className="bg-[#1A1A1A] border border-[#2A2A2A]">
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-[#00A6B2] data-[state=active]:text-[#EAEAEA] text-[#C0C0C0]"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="data-[state=active]:bg-[#00A6B2] data-[state=active]:text-[#EAEAEA] text-[#C0C0C0]"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:bg-[#00A6B2] data-[state=active]:text-[#EAEAEA] text-[#C0C0C0]"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-[#00A6B2] data-[state=active]:text-[#EAEAEA] text-[#C0C0C0]"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="h-full">
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#EAEAEA]">Products</CardTitle>
              <Drawer 
                open={isCreateProductDrawerOpen} 
                onOpenChange={setIsCreateProductDrawerOpen}
              >
                <DrawerTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-[#00A6B2] text-[#EAEAEA] hover:bg-[#008A94] border-[#2A2A2A]"
                  >
                    Add Product
                  </Button>
                </DrawerTrigger>
                <DrawerContent 
                  className="bg-[#1A1A1A] border-t border-[#2A2A2A]"
                >
                  <div className="mx-auto w-full max-w-sm">
                    <Form {...form}>
                      <form 
                        onSubmit={form.handleSubmit(onSubmitProduct)} 
                        className="space-y-4 text-[#EAEAEA]"
                      >
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#C0C0C0]">Product Title</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-[#2A2A2A] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2]"
                                  placeholder="Enter product title"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[#FF3737]" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#C0C0C0]">Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  className="bg-[#2A2A2A] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2]"
                                  placeholder="Enter product description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[#FF3737]" />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#C0C0C0]">Price</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="text"
                                    className="bg-[#2A2A2A] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2]"
                                    placeholder="0.00"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Enter price in your store's currency</FormDescription>
                                <FormMessage className="text-[#FF3737]" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#C0C0C0]">Quantity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    className="bg-[#2A2A2A] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2]"
                                    placeholder="0"
                                    min="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-[#FF3737]" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#C0C0C0]">SKU</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="bg-[#2A2A2A] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2]"
                                    placeholder="Enter SKU"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-[#FF3737]" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="vendor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#C0C0C0]">Vendor (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="bg-[#2A2A2A] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2]"
                                    placeholder="Enter vendor name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-[#FF3737]" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-[#00A6B2] hover:bg-[#008A94]"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? 'Adding Product...' : 'Add Product'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </DrawerContent>
              </Drawer>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <ScrollArea className="h-full w-full">
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between border-b border-[#2A2A2A] pb-2"
                    >
                      <div>
                        <div className="font-medium text-[#EAEAEA]">{product.title}</div>
                        <div className="text-sm text-[#C0C0C0]">
                          Price: ${product.price}
                        </div>
                      </div>
                      <Badge 
                        variant={product.inventory > 10 ? 'default' : 'destructive'}
                        className={`
                          ${product.inventory > 10 
                            ? 'bg-[#00A6B2]/20 text-[#00A6B2]' 
                            : 'bg-destructive/20 text-destructive'}
                        `}
                      >
                        Inventory: {product.inventory}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="h-full">
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] h-full">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <ScrollArea className="h-full w-full">
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between border-b border-[#2A2A2A] pb-2"
                    >
                      <div>
                        <div className="font-medium text-[#EAEAEA]">{order.customerName}</div>
                        <div className="text-sm text-[#C0C0C0]">
                          {order.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline"
                          className="bg-[#00A6B2]/20 text-[#00A6B2]"
                        >
                          {order.status}
                        </Badge>
                        <div className="font-bold text-[#EAEAEA]">${order.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="h-full">
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] h-full">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">Top Customers</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <ScrollArea className="h-full w-full">
                <div className="grid gap-4">
                  {customers.map((customer) => (
                    <div 
                      key={customer.id} 
                      className="flex items-center justify-between border-b border-[#2A2A2A] pb-2"
                    >
                      <div>
                        <div className="font-medium text-[#EAEAEA]">{customer.name}</div>
                        <div className="text-sm text-[#C0C0C0]">
                          {customer.email}
                        </div>
                      </div>
                      <div className="font-bold text-[#EAEAEA]">
                        Total Spent: ${customer.totalSpent}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="h-full">
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] h-full">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">Store Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <div className="grid md:grid-cols-2 gap-4 h-full">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#EAEAEA]">Performance Metrics</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-[#C0C0C0]">Conversion Rate</span>
                      <Badge 
                        variant="outline"
                        className="bg-[#00A6B2]/20 text-[#00A6B2]"
                      >
                        3.5%
                      </Badge>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#C0C0C0]">Average Order Value</span>
                      <Badge 
                        variant="outline"
                        className="bg-[#00A6B2]/20 text-[#00A6B2]"
                      >
                        $85.50
                      </Badge>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#C0C0C0]">Cart Abandonment Rate</span>
                      <Badge 
                        variant="destructive"
                        className="bg-destructive/20 text-destructive"
                      >
                        68%
                      </Badge>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#EAEAEA]">Store Health</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-[#C0C0C0]">Active Products</span>
                      <Badge 
                        variant="default"
                        className="bg-[#00A6B2]/20 text-[#00A6B2]"
                      >
                        {metrics.totalProducts}
                      </Badge>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#C0C0C0]">Pending Orders</span>
                      <Badge 
                        variant="outline"
                        className="bg-[#00A6B2]/20 text-[#00A6B2]"
                      >
                        12
                      </Badge>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#C0C0C0]">Customer Satisfaction</span>
                      <Badge 
                        variant="default"
                        className="bg-[#00A6B2]/20 text-[#00A6B2]"
                      >
                        4.2/5
                      </Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

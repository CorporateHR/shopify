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
    <div className="p-4 relative h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.totalRevenue?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="h-[calc(100vh-16rem)]">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <ScrollArea className="h-full w-full">
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Price: ${product.price}
                        </div>
                      </div>
                      <Badge 
                        variant={product.inventory > 10 ? 'default' : 'destructive'}
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
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <ScrollArea className="h-full w-full">
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{order.status}</Badge>
                        <div className="font-bold">${order.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <ScrollArea className="h-full w-full">
                <div className="grid gap-4">
                  {customers.map((customer) => (
                    <div 
                      key={customer.id} 
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.email}
                        </div>
                      </div>
                      <div className="font-bold">
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
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Store Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-3rem)] overflow-auto">
              <div className="grid md:grid-cols-2 gap-4 h-full">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Conversion Rate</span>
                      <Badge variant="outline">3.5%</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Average Order Value</span>
                      <Badge variant="outline">$85.50</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Cart Abandonment Rate</span>
                      <Badge variant="destructive">68%</Badge>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Store Health</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Active Products</span>
                      <Badge variant="default">{metrics.totalProducts}</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Pending Orders</span>
                      <Badge variant="outline">12</Badge>
                    </li>
                    <li className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <Badge variant="default">4.2/5</Badge>
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

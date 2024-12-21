"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Store, 
  Link2, 
  CheckCircle2, 
  AlertTriangle,
  PlusCircle,
  MoreVertical,
  Trash2,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Store {
  id: string;
  name: string;
  url: string;
  products: number;
  orders: number;
  lastSync: string;
  status: 'connected' | 'error';
}

export default function StoreConnectionPage() {
  const [stores, setStores] = useState<Store[]>([
    {
      id: '1',
      name: 'Fashion Haven',
      url: 'https://fashion-haven.myshopify.com',
      products: 250,
      orders: 1500,
      lastSync: '2 hours ago',
      status: 'connected'
    },
    {
      id: '2',
      name: 'Tech Emporium',
      url: 'https://tech-emporium.myshopify.com',
      products: 120,
      orders: 750,
      lastSync: '45 minutes ago',
      status: 'connected'
    },
    {
      id: '3',
      name: 'Home Essentials',
      url: 'https://home-essentials.myshopify.com',
      products: 80,
      orders: 300,
      lastSync: '1 day ago',
      status: 'error'
    }
  ]);

  const [newStoreUrl, setNewStoreUrl] = useState('');
  const [isAddStoreDialogOpen, setIsAddStoreDialogOpen] = useState(false);

  const handleAddStore = () => {
    if (!newStoreUrl.trim()) return;

    try {
      const url = new URL(newStoreUrl);
      const newStore: Store = {
        id: `store-${stores.length + 1}`,
        name: url.hostname.replace('www.', '').replace('.myshopify.com', '').split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        url: newStoreUrl,
        products: 0,
        orders: 0,
        lastSync: 'Just Now',
        status: 'connected'
      };

      setStores([...stores, newStore]);
      setNewStoreUrl('');
      setIsAddStoreDialogOpen(false);
    } catch (error) {
      alert('Please enter a valid Shopify store URL');
    }
  };

  const handleRemoveStore = (storeId: string) => {
    setStores(stores.filter(store => store.id !== storeId));
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="relative p-4 md:p-6">
          <div className="absolute top-4 right-4">
            <Dialog 
              open={isAddStoreDialogOpen} 
              onOpenChange={setIsAddStoreDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Store
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95%] max-w-md rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg">Connect New Shopify Store</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Enter your Shopify store URL to integrate
                  </p>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 items-center gap-2">
                    <Label htmlFor="store-url" className="text-left">
                      Store URL
                    </Label>
                    <Input 
                      id="store-url" 
                      placeholder="https://your-store.myshopify.com" 
                      className="w-full"
                      value={newStoreUrl}
                      onChange={(e) => setNewStoreUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={handleAddStore}>
                    Connect Store
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Store className="w-6 h-6 md:w-10 md:h-10 text-primary" />
            <div>
              <CardTitle className="text-lg md:text-xl">Store Management</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Connect, manage, and sync your Shopify stores
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-4 md:p-6">
          <ScrollArea className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {stores.map((store) => (
                <Card 
                  key={store.id} 
                  className={`
                    border-2 w-full
                    ${store.status === 'connected' 
                      ? 'border-green-500/20 hover:border-green-500/40' 
                      : 'border-red-500/20 hover:border-red-500/40'}
                  `}
                >
                  <CardHeader className="pb-2 p-3 md:p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                        <CardTitle className="text-sm md:text-base">{store.name}</CardTitle>
                      </div>
                      <Badge 
                        variant={store.status === 'connected' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {store.status === 'connected' ? 'Connected' : 'Error'}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-xs truncate">
                      {store.url}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4">
                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                      <div>
                        <p className="text-muted-foreground">Products</p>
                        <p className="font-semibold">{store.products}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-semibold">{store.orders}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-3 md:p-4 pt-2">
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                      Last Sync: {store.lastSync}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Store Actions</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-blue-600">
                          <Settings className="mr-2 h-4 w-4" />
                          Store Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleRemoveStore(store.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Store
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

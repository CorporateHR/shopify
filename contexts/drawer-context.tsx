"use client";

import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerContentConfig {
  content: string;
  title?: string;
  props?: Record<string, any>;
}

interface DrawerContextType {
  isOpen: boolean;
  openDrawer: (config: DrawerContentConfig) => void;
  closeDrawer: () => void;
  drawerContent: DrawerContentConfig | null;
}

export const DrawerContext = createContext<DrawerContextType>({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  drawerContent: null
});

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContentConfig | null>(null);

  const openDrawer = useCallback((config: DrawerContentConfig) => {
    setDrawerContent(config);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setDrawerContent(null);
  }, []);

  const renderDrawerContent = () => {
    if (!drawerContent) return null;

    switch (drawerContent.content) {
      default:
        return null;
    }
  };

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, drawerContent }}>
      {children}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent 
          showCloseButton={true}
          onClose={closeDrawer}
          className="bg-[#1A1A1A] border-t border-[#2A2A2A] text-[#EAEAEA]"
        >
          {drawerContent?.title && (
            <div className="px-6 py-4 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-semibold text-[#EAEAEA]">{drawerContent.title}</h2>
            </div>
          )}
          <div className="flex-1">
            {renderDrawerContent()}
          </div>
        </DrawerContent>
      </Drawer>
    </DrawerContext.Provider>
  );
}

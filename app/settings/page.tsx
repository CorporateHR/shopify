"use client";

import { useState } from 'react';
import AppLayout from "@/components/layout/app-layout";
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  CloudCog, 
  Palette, 
  Globe 
} from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const settingsSections = [
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: User,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#EAEAEA]">Profile Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">First Name</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
                defaultValue="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">Last Name</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
                defaultValue="Doe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#C0C0C0]">Email</label>
              <input 
                type="email" 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
                defaultValue="john.doe@example.com"
              />
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'security', 
      name: 'Security', 
      icon: Lock,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#EAEAEA]">Security Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">Current Password</label>
              <input 
                type="password" 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">New Password</label>
              <input 
                type="password" 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">Confirm New Password</label>
              <input 
                type="password" 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
              />
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#EAEAEA]">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#C0C0C0]">Email Notifications</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-[#2A2A2A] border-4 border-[#00A6B2] appearance-none cursor-pointer"
                />
                <label 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-[#1A1A1A] cursor-pointer"
                ></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#C0C0C0]">SMS Notifications</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-[#2A2A2A] border-4 border-[#00A6B2] appearance-none cursor-pointer"
                />
                <label 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-[#1A1A1A] cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'integrations', 
      name: 'Integrations', 
      icon: CloudCog,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#EAEAEA]">Connected Integrations</h2>
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between bg-[#2A2A2A] shadow rounded-lg p-4 border border-[#1A1A1A]"
            >
              <div className="flex items-center space-x-4">
                <img 
                  src="/shopify-logo.png" 
                  alt="Shopify" 
                  className="w-10 h-10"
                />
                <span className="text-[#EAEAEA]">Shopify Store</span>
              </div>
              <span className="text-[#00A6B2]">Connected</span>
            </div>
            <div 
              className="flex items-center justify-between bg-[#2A2A2A] shadow rounded-lg p-4 border border-[#1A1A1A]"
            >
              <div className="flex items-center space-x-4">
                <img 
                  src="/google-logo.png" 
                  alt="Google" 
                  className="w-10 h-10"
                />
                <span className="text-[#EAEAEA]">Google Drive</span>
              </div>
              <button className="text-[#00A6B2]">Connect</button>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'appearance', 
      name: 'Appearance', 
      icon: Palette,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#EAEAEA]">Appearance Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">Theme</label>
              <select 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">Accent Color</label>
              <div className="mt-2 flex space-x-3">
                {['#3B82F6', '#10B981', '#6366F1', '#EC4899'].map((color) => (
                  <button 
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-[#2A2A2A] hover:border-[#00A6B2]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'language', 
      name: 'Language', 
      icon: Globe,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#EAEAEA]">Language & Region</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">Application Language</label>
              <select 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
              >
                <option>English (United States)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C0C0C0]">Time Zone</label>
              <select 
                className="mt-1 block w-full rounded-md border-[#2A2A2A] bg-[#2A2A2A] text-[#EAEAEA] shadow-sm focus:border-[#00A6B2]"
              >
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <AppLayout className="bg-[#121212] text-[#EAEAEA]">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#EAEAEA]">Account Settings</h1>
          <p className="text-[#C0C0C0]">
            Manage your profile and application preferences
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div 
            className="bg-[#1A1A1A] shadow rounded-lg p-4 space-y-2 border border-[#2A2A2A]"
          >
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-md transition-colors
                  ${activeSection === section.id 
                    ? 'bg-[#00A6B2]/20 text-[#00A6B2]' 
                    : 'hover:bg-[#2A2A2A] text-[#C0C0C0]'
                  }
                `}
              >
                <section.icon className="w-5 h-5 text-[#00A6B2]" />
                <span>{section.name}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div 
            className="md:col-span-3 bg-[#1A1A1A] shadow rounded-lg p-8 border border-[#2A2A2A]"
          >
            {settingsSections.find(section => section.id === activeSection)?.content}
            
            <div className="mt-8 flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-[#2A2A2A] text-[#C0C0C0] rounded-md hover:bg-[#00A6B2]/20"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-[#00A6B2] text-white rounded-md hover:bg-[#008A94]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

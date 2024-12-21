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
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                defaultValue="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                defaultValue="Doe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
          <h2 className="text-2xl font-semibold">Security Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input 
                type="password" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input 
                type="password" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                type="password" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
          <h2 className="text-2xl font-semibold">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
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
          <h2 className="text-2xl font-semibold">Connected Integrations</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src="/shopify-logo.png" 
                  alt="Shopify" 
                  className="w-10 h-10"
                />
                <span>Shopify Store</span>
              </div>
              <span className="text-green-500">Connected</span>
            </div>
            <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src="/google-logo.png" 
                  alt="Google" 
                  className="w-10 h-10"
                />
                <span>Google Drive</span>
              </div>
              <button className="text-blue-500">Connect</button>
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
          <h2 className="text-2xl font-semibold">Appearance Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Accent Color</label>
              <div className="mt-2 flex space-x-3">
                {['#3B82F6', '#10B981', '#6366F1', '#EC4899'].map((color) => (
                  <button 
                    key={color}
                    className="w-8 h-8 rounded-full"
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
          <h2 className="text-2xl font-semibold">Language & Region</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Language</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option>English (United States)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Zone</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
    <AppLayout>
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="bg-white shadow rounded-lg p-4 space-y-2">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-md transition-colors
                ${activeSection === section.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-white shadow rounded-lg p-8">
          {settingsSections.find(section => section.id === activeSection)?.content}
          
          <div className="mt-8 flex justify-end space-x-4">
            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

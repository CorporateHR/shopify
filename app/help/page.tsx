"use client";

import { useState } from 'react';
import AppLayout from "@/components/layout/app-layout";
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Video, 
  Mail, 
  FileQuestion 
} from 'lucide-react';

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('faq');

  const helpSections = [
    {
      id: 'faq',
      name: 'Frequently Asked Questions',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          {[
            {
              question: 'How do I upload my Shopify products?',
              answer: 'Use the Upload page to drag and drop your CSV or Excel files. Our system will automatically parse and validate the data for Shopify compatibility.'
            },
            {
              question: 'What file formats are supported?',
              answer: 'We support CSV, XLSX, and TXT files. Ensure your file follows the Shopify product import template.'
            },
            {
              question: 'Can I connect multiple Shopify stores?',
              answer: 'Yes, you can connect and manage multiple Shopify stores from the Integrations section in Settings.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'docs',
      name: 'Documentation',
      icon: Book,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">User Documentation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Getting Started Guide', description: 'Learn how to use our Shopify CSV tool' },
              { title: 'File Upload Basics', description: 'Understand file upload and validation process' },
              { title: 'Shopify Integration', description: 'Connect and manage your Shopify stores' },
              { title: 'Troubleshooting', description: 'Common issues and their solutions' }
            ].map((doc, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{doc.title}</h3>
                <p className="text-gray-600 text-sm">{doc.description}</p>
                <button className="mt-2 text-blue-600 hover:underline">Read More</button>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'support',
      name: 'Contact Support',
      icon: MessageCircle,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Contact Support</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <Mail className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email</p>
              <a 
                href="mailto:support@shopifycsv.com" 
                className="text-blue-600 hover:underline"
              >
                support@shopifycsv.com
              </a>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <MessageCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Instant support during business hours</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tutorials',
      name: 'Video Tutorials',
      icon: Video,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Video Tutorials</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                title: 'Getting Started', 
                description: 'Introduction to Shopify CSV Tool',
                thumbnail: '/tutorial-1.jpg'
              },
              { 
                title: 'File Upload Process', 
                description: 'How to upload and validate files',
                thumbnail: '/tutorial-2.jpg'
              },
              { 
                title: 'Shopify Integration', 
                description: 'Connecting your Shopify store',
                thumbnail: '/tutorial-3.jpg'
              }
            ].map((tutorial, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img 
                  src={tutorial.thumbnail} 
                  alt={tutorial.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tutorial.description}</p>
                  <button className="text-blue-600 hover:underline flex items-center">
                    <Video className="w-5 h-5 mr-2" /> Watch Tutorial
                  </button>
                </div>
              </div>
            ))}
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
          {helpSections.map((section) => (
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
          {helpSections.find(section => section.id === activeSection)?.content}
        </div>
      </div>
    </AppLayout>
  );
}

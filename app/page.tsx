"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileSpreadsheet, Upload, Download, Zap, Shield, BarChart3, FileCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Shopify CSV</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Documentation</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Transform Your Product Data for Shopify in Seconds
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Effortlessly convert your product data from any format into Shopify-ready CSV files.
            Save hours of manual work with our intelligent data mapping system.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2">
              Start Converting <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Seamless Product Data Migration
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Upload}
              title="Multiple Format Support"
              description="Import data from Excel, CSV, XML and more. We handle all the heavy lifting."
            />
            <FeatureCard
              icon={Download}
              title="Shopify Ready"
              description="Automatically map and transform your data to match Shopify's product template."
            />
            <FeatureCard
              icon={Zap}
              title="AI-Powered Mapping"
              description="Our intelligent system learns from your data to suggest the most accurate field mappings."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="Your data is encrypted and processed locally. We never store sensitive information."
            />
            <FeatureCard
              icon={BarChart3}
              title="Performance Insights"
              description="Get detailed analytics and insights about your product data transformation."
            />
            <FeatureCard
              icon={FileCheck}
              title="Data Validation"
              description="Automatically detect and flag potential errors or inconsistencies in your data."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Upload Your File"
              description="Upload your product data in any common format - Excel, CSV, or XML."
            />
            <StepCard
              number={2}
              title="Review Mapping"
              description="Our system automatically maps your data fields to Shopify's format."
            />
            <StepCard
              number={3}
              title="Export or Upload"
              description="Download the converted file or directly upload to your Shopify store."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Streamline Your Product Data Migration?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Shopify merchants who trust us with their product data
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Get Started for Free <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Shopify CSV</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making product data migration simple and efficient for Shopify merchants.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} Shopify CSV. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>, 
  title: string, 
  description: string 
}) {
  return (
    <Card className="p-6">
      <div className="mb-4 text-primary">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function StepCard({ 
  number, 
  title, 
  description 
}: { 
  number: number, 
  title: string, 
  description: string 
}) {
  return (
    <Card className="p-6 relative">
      <div className="text-6xl font-bold text-primary/10 absolute top-4 right-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}
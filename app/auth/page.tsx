"use client";

import { LoginForm } from "@/components/auth/login-form";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
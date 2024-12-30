"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/auth/icons";
import { AuthMode } from "@/app/auth/page";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export function RegisterForm({ onModeChange }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    setError(null);
    
    try {
      // Implement your registration logic here
      console.log(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 bg-[#1A1A1A] p-8 rounded-lg border border-[#2A2A2A]">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[#EAEAEA]">Create an account</h1>
        <p className="text-sm text-[#C0C0C0]">
          Enter your details below to create your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-[#121212] border-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#C0C0C0]">Name</Label>
          <Input
            id="name"
            {...form.register("name")}
            className={cn(
              "bg-[#121212] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2] focus:border-[#00A6B2]",
              form.formState.errors.name && "border-destructive"
            )}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive text-[#C0C0C0]">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#C0C0C0]">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            className={cn(
              "bg-[#121212] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2] focus:border-[#00A6B2]",
              form.formState.errors.email && "border-destructive"
            )}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive text-[#C0C0C0]">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#C0C0C0]">Password</Label>
          <Input
            id="password"
            type="password"
            {...form.register("password")}
            className={cn(
              "bg-[#121212] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2] focus:border-[#00A6B2]",
              form.formState.errors.password && "border-destructive"
            )}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive text-[#C0C0C0]">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#C0C0C0]">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...form.register("confirmPassword")}
            className={cn(
              "bg-[#121212] border-[#2A2A2A] text-[#EAEAEA] focus:ring-[#00A6B2] focus:border-[#00A6B2]",
              form.formState.errors.confirmPassword && "border-destructive"
            )}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive text-[#C0C0C0]">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#00A6B2] text-white hover:bg-[#008A94]" 
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin text-white" />}
          Sign Up
        </Button>
      </form>

      <div className="text-center text-sm text-[#C0C0C0]">
        Already have an account?{" "}
        <Button
          variant="link"
          className="px-0 text-[#00A6B2] hover:text-[#008A94]"
          onClick={() => onModeChange("login")}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
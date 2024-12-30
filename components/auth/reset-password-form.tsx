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

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetFormData = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export function ResetPasswordForm({ onModeChange }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  async function onSubmit(data: ResetFormData) {
    setIsLoading(true);
    setError(null);
    
    try {
      // Implement your password reset logic here
      console.log(data);
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 bg-[#1A1A1A] p-8 rounded-lg border border-[#2A2A2A]">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[#EAEAEA]">Reset password</h1>
        <p className="text-sm text-[#C0C0C0]">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-[#121212] border-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <div className="space-y-6">
          <Alert className="bg-[#121212] border-[#2A2A2A] text-[#C0C0C0]">
            <AlertDescription>
              If an account exists with that email, you will receive a password reset link shortly.
            </AlertDescription>
          </Alert>
          <Button
            variant="link"
            className="w-full text-[#00A6B2] hover:text-[#008A94]"
            onClick={() => onModeChange("login")}
          >
            Back to login
          </Button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button 
            type="submit" 
            className="w-full bg-[#00A6B2] text-white hover:bg-[#008A94]" 
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin text-white" />}
            Send reset link
          </Button>

          <Button
            type="button"
            variant="link"
            className="w-full text-[#00A6B2] hover:text-[#008A94]"
            onClick={() => onModeChange("login")}
          >
            Back to login
          </Button>
        </form>
      )}
    </div>
  );
}
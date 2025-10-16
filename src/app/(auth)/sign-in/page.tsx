"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    try {
      await signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/dashboard",
          rememberMe: values.rememberMe,
        },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
        },
      );
      toast.success("Login successful!");
    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="font-bold text-2xl">Login to your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials below to access your account.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldSet>
          <FieldGroup className="gap-4">
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Field orientation="horizontal">
              {/* Remember me */}
              <Controller
                name="rememberMe"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(!!v)}
                    />
                    <FieldLabel htmlFor="rememberMe">Remember me</FieldLabel>
                  </Field>
                )}
              />
              {/* Forgot password */}
              <Button variant="link" asChild className="px-0">
                <Link href="/">Forgot password?</Link>
              </Button>
            </Field>

            {/* Submit */}
            <Field>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </Field>
            <FieldSeparator>Or continue with</FieldSeparator>
            <Field>
              <Button variant="outline" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>Github Logo</title>
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                Login with GitHub
              </Button>
              <Button variant="outline" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <title>Google Logo</title>
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  />
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  />
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  />
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  />
                </svg>
                Login with GitHub
              </Button>
            </Field>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="pl-1 underline underline-offset-4"
              >
                Sign up
              </Link>
            </FieldDescription>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}

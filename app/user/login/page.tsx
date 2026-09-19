"use client";

import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { Button, Card, Field, Input } from "@/components/ui";
import AuthShell from "@/components/AuthShell";
import { useRouter } from "next/navigation";
import { login } from "@/lib/frontend-data";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ username, password });
      router.push("/dashboard");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold tracking-[-0.03em]">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-[--muted]">
          Sign in to pick up where you left off.
        </p>
        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <Field label="Username">
            <Input
              type="text"
              placeholder="Your username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              placeholder="Your password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-(--danger-soft) px-3 py-2 text-sm text-(--danger)"
            >
              {error}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[--muted]">
          New to Study Planner?{" "}
          <Link
            href="/register"
            className="font-semibold text-[--accent] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </AuthShell>
  );
}

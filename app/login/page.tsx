"use client";

import Link from "next/link";
import { Button, Card, Field, Input } from "@/components/ui";
import AuthShell from "@/components/AuthShell";

export default function LoginPage() {
  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold tracking-[-0.03em]">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Sign in to pick up where you left off.
        </p>
        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <Field label="Email">
            <Input type="email" placeholder="you@example.com" required />
          </Field>
          <Field label="Password">
            <Input type="password" placeholder="Your password" required />
          </Field>
          <Button className="w-full" type="submit">
            Log in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          New to Study Planner?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </AuthShell>
  );
}

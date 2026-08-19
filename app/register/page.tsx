"use client";

import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { Button, Card, Field, Input, Select } from "@/components/ui";

export default function RegisterPage() {
  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold tracking-[-0.03em]">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Start with a simple view of your academic week.
        </p>
        <form onSubmit={handleRegister} className="mt-7 space-y-4">
          <Field label="Name">
            <Input placeholder="Your name" required />
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="you@example.com" required />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </Field>
          <Field label="Confirm password">
            <Input
              type="password"
              placeholder="Repeat your password"
              minLength={8}
              required
            />
          </Field>
          <Field label="Role">
            <Select defaultValue="student">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </Select>
          </Field>
          <Button className="mt-2 w-full" type="submit">
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            Log in
          </Link>
        </p>
      </Card>
    </AuthShell>
  );
}

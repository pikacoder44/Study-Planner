"use client";

import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { Button, Card, Field, Input } from "@/components/ui";
import AuthShell from "@/components/AuthShell";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    if (response.ok) {
      router.push("/dashboard");
    }

  }

  return (
    <AuthShell>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold tracking-[-0.03em]">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-[--muted]">
          Sign in to pick up where you left off.
        </p>
        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <Field label="Username">
            <Input type="text" placeholder="Your username" required  onChange={(e) => setUsername(e.target.value)} />
          </Field>
          <Field label="Password">
            <Input type="password" placeholder="Your password" required onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Button className="w-full" type="submit">
            Log in
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

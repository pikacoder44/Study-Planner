"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthShell from "@/components/AuthShell";
import { Button, Card, Field, Input, Select } from "@/components/ui";
import { register } from "@/lib/frontend-data";

const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      await register({ username, password, confirmPassword, role });
      router.push("/dashboard");
    } catch (registerError) {
      setErrors([
        registerError instanceof Error
          ? registerError.message
          : "Something went wrong. Please try again.",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold tracking-[-0.03em]">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-6 text-(--muted)">
          Set up a focused workspace for your studies.
        </p>
        <form onSubmit={registerUser} className="mt-7 space-y-5">
          <Field label="Username">
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Your username"
              required
              minLength={3}
            />
          </Field>
          <Field label="Role">
            <Select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </Select>
          </Field>
          <Field label="Password" hint="Use at least 8 characters.">
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Create a password"
              required
              minLength={8}
            />
          </Field>
          <Field label="Confirm password">
            <Input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              placeholder="Repeat your password"
              required
            />
          </Field>
          {errors.length > 0 && (
            <div
              role="alert"
              className="space-y-1 rounded-xl bg-(--danger-soft) px-3 py-2 text-sm text-(--danger)"
            >
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-(--muted)">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-(--accent) hover:underline"
          >
            Log in
          </Link>
        </p>
      </Card>
    </AuthShell>
  );
};

export default RegisterUser;

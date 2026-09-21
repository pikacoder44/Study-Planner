"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { getProfile, updateProfile } from "@/lib/frontend-data";

type ProfileUser = { _id?: string; username: string; email?: string };

export default function UpdateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void getProfile<ProfileUser>()
      .then((data) => {
        setUser(data.user);
        setUsername(data.user.username);
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load profile.",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile({ username: username.trim() });
      router.push("/user/profile");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update profile.",
      );
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Profile"
        title="Update your profile"
        description="Keep the account identity shown across your study planner current."
      />
      {loading && <p className="text-sm text-(--muted)">Loading profile...</p>}
      {!loading && user && (
        <Card className="max-w-2xl p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Username">
              <Input
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                minLength={3}
              />
            </Field>
            <Field label="Email">
              <Input value={user.email ?? "Not available"} disabled />
            </Field>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-(--danger-soft) p-3 text-sm text-(--danger)"
              >
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3 border-t border-(--border) pt-5">
              <Link href="/user/profile">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      )}
      {!loading && !user && error && (
        <p
          role="alert"
          className="rounded-xl bg-(--danger-soft) p-4 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}
    </AppShell>
  );
}

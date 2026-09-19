"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Select,
  PageHeader,
} from "@/components/ui";
import { getProfile } from "@/lib/frontend-data";

type Profile = { username?: string;};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({});

  useEffect(() => {
    void getProfile<Profile>().then(({ user }) => setProfile(user)).catch(() => undefined);
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Your workspace"
        title="Settings"
        description="Personal details and preferences for this device."
      />
      <div className="grid max-w-4xl gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-(--border) pb-4">
            <div>
              <h2 className="font-bold">Profile</h2>
              <p className="mt-1 text-sm text-(--muted)">
                This information is shown in your planner.
              </p>
            </div>
            <Badge tone="blue">{profile.role ?? "Student"}</Badge>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Name">
              <Input defaultValue={profile.username ?? ""} />
            </Field>
            <Field label="Email">
              <Input defaultValue={profile.email ?? ""} type="email" />
            </Field>
            <Field label="Role">
              <Select defaultValue={profile.role ?? "student"}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </Select>
            </Field>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-bold">Preferences</h2>
          <p className="mt-1 text-sm text-(--muted)">
            Choose how Study Planner keeps you informed.
          </p>
          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold">
                  Deadline reminders
                </span>
                <span className="text-xs text-(--muted)">
                  Receive a reminder before tasks are due.
                </span>
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-(--accent)"
              />
            </label>
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold">
                  Weekly summary
                </span>
                <span className="text-xs text-(--muted)">
                  Get a short review of your study week.
                </span>
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-(--accent)"
              />
            </label>
          </div>
        </Card>
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Download,
  FileDown,
  KeyRound,
  Palette,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import AppShell from "@/components/AppShell";
import { changePassword, getProfile, updateProfile } from "@/lib/frontend-data";
import { Button, Input, Select, Textarea } from "@/components/ui";

type Tab = "profile" | "security" | "preferences" | "data";
type Profile = { _id?: string; username: string; email?: string };
type ProfileDraft = {
  username: string;
  bio: string;
  targetHours: string;
  avatarDataUrl: string;
};
type Preferences = {
  dailyGoal: string;
  emailReminders: boolean;
  examReminders: boolean;
  twoFactor: boolean;
  dataVisibility: string;
};

const profileKey = "study-planner:settings-profile";
const preferencesKey = "study-planner:settings";
const defaultProfile: ProfileDraft = {
  username: "",
  bio: "",
  targetHours: "10",
  avatarDataUrl: "",
};
const defaultPreferences: Preferences = {
  dailyGoal: "2",
  emailReminders: true,
  examReminders: true,
  twoFactor: false,
  dataVisibility: "private",
};
const tabs: Array<[Tab, string, LucideIcon]> = [
  ["profile", "Edit profile", UserRound],
  ["security", "Privacy & security", Shield],
  ["preferences", "Preferences & theme", Palette],
  ["data", "Account & data", FileDown],
];

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) ${checked ? "bg-(--primary)" : "bg-(--border)"}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-(--foreground)">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs text-(--muted)">{hint}</span>
      )}
    </label>
  );
}

function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileDraft, setProfileDraft] =
    useState<ProfileDraft>(defaultProfile);
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedProfile = window.localStorage.getItem(profileKey);
      const storedPreferences = window.localStorage.getItem(preferencesKey);
      if (storedProfile) {
        try {
          setProfileDraft({
            ...defaultProfile,
            ...(JSON.parse(storedProfile) as Partial<ProfileDraft>),
          });
        } catch {
          window.localStorage.removeItem(profileKey);
        }
      }
      if (storedPreferences) {
        try {
          setPreferences({
            ...defaultPreferences,
            ...(JSON.parse(storedPreferences) as Partial<Preferences>),
          });
        } catch {
          window.localStorage.removeItem(preferencesKey);
        }
      }
      setReady(true);
    });
    void getProfile<Profile>()
      .then(({ user }) => {
        setProfile(user);
        setProfileDraft((current) => ({ ...current, username: user.username }));
      })
      .catch(() => undefined);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const initials = useMemo(
    () => (profileDraft.username || "SP").slice(0, 2).toUpperCase(),
    [profileDraft.username],
  );
  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setStatus("");
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setSaving(true);
    try {
      if (profileDraft.username.trim() !== profile?.username) {
        const result = await updateProfile<Profile>({
          username: profileDraft.username.trim(),
        });
        setProfile(result.user);
      }
      window.localStorage.setItem(profileKey, JSON.stringify(profileDraft));
      setStatus("Profile saved");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = () => {
    window.localStorage.setItem(preferencesKey, JSON.stringify(preferences));
    setStatus("Preferences saved");
    setError("");
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    if (passwords.next !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setStatus("Password updated");
    } catch (passwordError) {
      setError(
        passwordError instanceof Error
          ? passwordError.message
          : "Unable to update password.",
      );
    } finally {
      setSaving(false);
    }
  };

  const exportData = (format: "json" | "csv") => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: profileDraft,
      preferences,
    };
    if (format === "json") {
      downloadFile(
        "study-planner-data.json",
        JSON.stringify(payload, null, 2),
        "application/json",
      );
      return;
    }
    const csv = [
      "setting,value",
      ...Object.entries({ ...profileDraft, ...preferences }).map(
        ([key, value]) => `${key},"${String(value).replaceAll('"', '""')}"`,
      ),
    ].join("\n");
    downloadFile("study-planner-settings.csv", csv, "text/csv");
  };

  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Delete your account and sign out? This cannot be undone.",
      )
    )
      return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch("/api/auth/account", { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete account.");
      window.localStorage.clear();
      router.push("/login");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete account.",
      );
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-(--primary-strong)">
            Workspace
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-(--foreground)">
            Settings
          </h1>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-(--danger-soft) px-4 py-3 text-sm font-semibold text-(--danger)"
          >
            {error}
          </p>
        )}
        <div className="grid overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-xs lg:grid-cols-[15rem_minmax(0,1fr)]">
          <nav
            className="border-b border-(--border) p-3 lg:border-b-0 lg:border-r"
            aria-label="Settings sections"
          >
            {tabs.map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  setStatus("");
                  setError("");
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${activeTab === id ? "bg-(--primary-soft) text-(--primary-strong)" : "text-(--muted) hover:bg-(--surface-muted) hover:text-(--foreground)"}`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
            <Link
              href="/user/profile"
              className="mt-5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-(--muted) hover:bg-(--surface-muted) hover:text-(--foreground)"
            >
              View profile
            </Link>
          </nav>
          <main className="min-w-0 p-5 sm:p-8">
            <div className="mb-7 flex items-center justify-between gap-4 border-b border-(--border) pb-5">
              <div>
                <h2 className="text-xl font-bold text-(--foreground)">
                  {tabs.find(([id]) => id === activeTab)?.[1]}
                </h2>
                <p className="mt-1 text-sm text-(--muted)">
                  Manage your study planner account.
                </p>
              </div>
              {activeTab === "profile" && (
                <div
                  className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-(--primary-soft) text-lg font-bold text-(--primary-strong)"
                  style={
                    profileDraft.avatarDataUrl
                      ? {
                          backgroundImage: `url(${profileDraft.avatarDataUrl})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                >
                  {!profileDraft.avatarDataUrl && initials}
                </div>
              )}
            </div>
            {activeTab === "profile" && (
              <form onSubmit={saveProfile} className="max-w-xl space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--primary-soft) text-lg font-extrabold text-(--primary-strong)">
                    {initials}
                  </div>
                  <label className="cursor-pointer text-sm font-bold text-(--primary-strong) hover:underline">
                    Change avatar
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () =>
                          setProfileDraft((current) => ({
                            ...current,
                            avatarDataUrl: String(reader.result),
                          }));
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Username">
                    <Input
                      value={profileDraft.username}
                      onChange={(event) =>
                        setProfileDraft((current) => ({
                          ...current,
                          username: event.target.value,
                        }))
                      }
                      required
                      minLength={3}
                    />
                  </Field>
                  <Field label="Email">
                    <Input value={profile?.email ?? "Not available"} disabled />
                  </Field>
                </div>
                <Field label="Study goal / bio">
                  <Textarea
                    value={profileDraft.bio}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        bio: event.target.value,
                      }))
                    }
                    placeholder="What are you working toward?"
                  />
                </Field>
                <Field label="Target study hours per week">
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={profileDraft.targetHours}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        targetHours: event.target.value,
                      }))
                    }
                  />
                </Field>
                <Button type="submit" disabled={!ready || saving}>
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              </form>
            )}
            {activeTab === "security" && (
              <div className="max-w-xl space-y-7">
                <form onSubmit={savePassword} className="space-y-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-(--foreground)">
                    <KeyRound size={17} className="text-(--muted)" />
                    Change password
                  </div>
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={passwords.current}
                    onChange={(event) =>
                      setPasswords((current) => ({
                        ...current,
                        current: event.target.value,
                      }))
                    }
                    required
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      type="password"
                      placeholder="New password"
                      minLength={8}
                      value={passwords.next}
                      onChange={(event) =>
                        setPasswords((current) => ({
                          ...current,
                          next: event.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      minLength={8}
                      value={passwords.confirm}
                      onChange={(event) =>
                        setPasswords((current) => ({
                          ...current,
                          confirm: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <Button type="submit" variant="secondary" disabled={saving}>
                    {saving ? "Updating..." : "Update password"}
                  </Button>
                </form>
                <div className="flex items-center justify-between gap-4 border-t border-(--border) pt-6">
                  <div>
                    <p className="text-sm font-semibold text-(--foreground)">
                      Two-factor authentication
                    </p>
                    <p className="mt-1 text-xs text-(--muted)">
                      Add another layer of protection to your account.
                    </p>
                  </div>
                  <Toggle
                    checked={preferences.twoFactor}
                    label="Toggle two-factor authentication"
                    onChange={() =>
                      updatePreference("twoFactor", !preferences.twoFactor)
                    }
                  />
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-(--foreground)">
                    Data visibility
                  </span>
                  <Select
                    value={preferences.dataVisibility}
                    onChange={(event) =>
                      updatePreference("dataVisibility", event.target.value)
                    }
                  >
                    <option value="private">Private</option>
                    <option value="classmates">Classmates</option>
                    <option value="public">Public</option>
                  </Select>
                </label>
              </div>
            )}
            {activeTab === "preferences" && (
              <div className="max-w-xl space-y-1">
                <label className="flex items-center justify-between gap-4 border-b border-(--border) py-5 text-sm font-semibold text-(--foreground)">
                  <span className="flex items-center gap-3">
                    <Palette size={18} className="text-(--muted)" />
                    Theme
                  </span>
                  <Select
                    aria-label="Theme"
                    value={theme ?? "system"}
                    onChange={(event) => setTheme(event.target.value)}
                    className="w-32"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </Select>
                </label>
                <div className="flex items-center justify-between gap-4 border-b border-(--border) py-5">
                  <span className="text-sm font-semibold text-(--foreground)">
                    Study reminders
                  </span>
                  <Toggle
                    checked={preferences.emailReminders}
                    label="Toggle study reminders"
                    onChange={() =>
                      updatePreference(
                        "emailReminders",
                        !preferences.emailReminders,
                      )
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-(--border) py-5">
                  <span className="text-sm font-semibold text-(--foreground)">
                    Exam countdown alerts
                  </span>
                  <Toggle
                    checked={preferences.examReminders}
                    label="Toggle exam countdown alerts"
                    onChange={() =>
                      updatePreference(
                        "examReminders",
                        !preferences.examReminders,
                      )
                    }
                  />
                </div>
                <Button
                  type="button"
                  onClick={savePreferences}
                  className="mt-5"
                >
                  {status === "Preferences saved" && <Check size={15} />}
                  {status === "Preferences saved"
                    ? "Saved"
                    : "Save preferences"}
                </Button>
              </div>
            )}
            {activeTab === "data" && (
              <div className="max-w-xl space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-(--foreground)">
                    Export your study data
                  </h3>
                  <p className="mt-1 text-sm text-(--muted)">
                    Download a copy of your account and planner preferences.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => exportData("json")}
                    >
                      <Download size={15} />
                      Export JSON
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => exportData("csv")}
                    >
                      <Download size={15} />
                      Export CSV
                    </Button>
                  </div>
                </div>
                <div className="border-t border-(--border) pt-7">
                  <div className="border border-(--danger)/30 bg-(--danger-soft) p-5">
                    <div className="flex items-start gap-3">
                      <Trash2
                        size={18}
                        className="mt-0.5 shrink-0 text-(--danger)"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-(--danger)">
                          Delete account
                        </h3>
                        <p className="mt-1 text-sm text-(--muted)">
                          Permanently delete your account and sign out.
                        </p>
                        <button
                          type="button"
                          onClick={deleteAccount}
                          disabled={deleting}
                          className="mt-4 text-sm font-bold text-(--danger) underline underline-offset-2"
                        >
                          {deleting ? "Deleting..." : "Delete my account"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(status || error) && (
              <p
                role={error ? "alert" : "status"}
                className={`mt-6 text-sm font-semibold ${error ? "text-(--danger)" : "text-(--support)"}`}
              >
                {error || status}
              </p>
            )}
          </main>
        </div>
      </div>
    </AppShell>
  );
}

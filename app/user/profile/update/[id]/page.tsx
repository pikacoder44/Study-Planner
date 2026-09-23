"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Save,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import AppShell from "@/components/AppShell";
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { getProfile, updateProfile } from "@/lib/frontend-data";

type ProfileUser = { _id?: string; username: string; email?: string };

type ToastState = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;

function ToastModal({
  toast,
  onClose,
}: {
  toast: ToastState;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all ${
          isSuccess
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
            : "border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-100"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
          />
        ) : (
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400"
          />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{toast.title}</p>
          <p className="mt-0.5 text-xs opacity-90">{toast.message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function UpdateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    void getProfile<ProfileUser>()
      .then((data) => {
        setUser(data.user);
        setUsername(data.user.username);
      })
      .catch((loadError) => {
        const msg =
          loadError instanceof Error
            ? loadError.message
            : "Unable to load profile.";
        setError(msg);
        setToast({
          type: "error",
          title: "Error Loading Profile",
          message: msg,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile({ username: username.trim() });
      setToast({
        type: "success",
        title: "Profile Updated",
        message: "Your username has been updated successfully.",
      });
      setTimeout(() => {
        router.push("/user/profile");
      }, 800);
    } catch (submitError) {
      const msg =
        submitError instanceof Error
          ? submitError.message
          : "Unable to update profile.";
      setError(msg);
      setToast({
        type: "error",
        title: "Update Failed",
        message: msg,
      });
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <ToastModal toast={toast} onClose={() => setToast(null)} />

      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href="/user/profile"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-(--muted) hover:text-(--foreground) transition-colors"
          >
            <ArrowLeft size={14} /> Back to profile
          </Link>
          <PageHeader
            eyebrow="Profile"
            title="Update Profile"
            description="Keep the account identity shown across your study planner current."
          />
        </div>

        {loading && (
          <div className="flex min-h-62.5 items-center justify-center rounded-xl border border-(--border) bg-(--surface)">
            <p className="flex items-center gap-2 text-sm font-semibold text-(--muted)">
              <LoaderCircle className="animate-spin" size={18} />
              Loading profile...
            </p>
          </div>
        )}

        {!loading && user && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card className="p-6 border border-(--border) bg-(--surface) shadow-xs">
              <form className="space-y-5" onSubmit={handleSubmit}>

                <Field label="Username">
                  <Input
                    name="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    minLength={3}
                    placeholder="Enter new username"
                  />
                </Field>

                <Field label="Email">
                  <Input value={user.email ?? "Not available"} disabled />
                </Field>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-(--danger-soft) p-3 text-sm font-semibold text-(--danger)"
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

                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{
                      scale: saving ? 1 : 1.02,
                      y: saving ? 0 : -1,
                    }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-(--primary-strong) disabled:opacity-60"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
                    <Save
                      size={16}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <span>{saving ? "Saving..." : "Save changes"}</span>
                  </motion.button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {!loading && !user && error && (
          <Card className="border-rose-500/30 bg-rose-500/10 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 text-rose-500" size={20} />
              <div>
                <p className="text-sm font-bold text-rose-500">
                  Could not load profile
                </p>
                <p className="mt-1 text-sm text-rose-400">{error}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

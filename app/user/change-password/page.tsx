"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Shield,
  X,
} from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import AppShell from "@/components/AppShell";
import { changePassword } from "@/lib/frontend-data";
import { Button, Card, Input, PageHeader } from "@/components/ui";

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

function PasswordInput({
  placeholder,
  value,
  onChange,
  required,
  minLength,
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted) hover:text-(--foreground) transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function ChangePasswordPage() {
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [toast, setToast] = useState<ToastState>(null);
  const [saving, setSaving] = useState(false);

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwords.next !== passwords.confirm) {
      setToast({
        type: "error",
        title: "Password Mismatch",
        message: "New passwords do not match.",
      });
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setToast({
        type: "success",
        title: "Password Updated",
        message:
          "Your password has been changed successfully. Use it for your next sign in.",
      });
    } catch (passwordError) {
      const failMessage =
        passwordError instanceof Error
          ? passwordError.message
          : "Unable to update password. Please check your current password.";
      setToast({
        type: "error",
        title: "Update Failed",
        message: failMessage,
      });
    } finally {
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
            eyebrow="Security"
            title="Change Password"
            description="Update your credentials to keep your account protected."
          />
        </div>

        <Card className="p-6 border border-(--border) bg-(--surface) shadow-xs">
          <form onSubmit={savePassword} className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-(--foreground)">
              <KeyRound size={18} className="text-(--primary-strong)" />
              Account Credentials
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-(--muted)">
                Current Password
              </label>
              <PasswordInput
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    current: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-(--muted)">
                  New Password
                </label>
                <PasswordInput
                  placeholder="Min 8 characters"
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
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-(--muted)">
                  Confirm New Password
                </label>
                <PasswordInput
                  placeholder="Re-enter new password"
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
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link href="/user/profile">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Shield size={16} />
                {saving ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
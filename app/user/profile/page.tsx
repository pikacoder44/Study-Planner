"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  KeyRound,
  LoaderCircle,
  LogOut,
  PencilLine,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getProfile, logout } from "@/lib/frontend-data";
import { Badge, Card, PageHeader } from "@/components/ui";

type UserRole = "student" | "teacher";

type UserProfileResponse = {
  _id?: string;
  username: string;
  role: UserRole;
  createdAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfile<UserProfileResponse>();
        setUser(data.user);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  const initials = (user?.username || "SP").slice(0, 2).toUpperCase();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Profile"
          title="Account Identity"
          description="Your current user credentials and account details."
        />

        {loading ? (
          <div className="flex min-h-75 items-center justify-center rounded-xl border border-(--border) bg-(--surface)">
            <p className="flex items-center gap-2 text-sm font-semibold text-(--muted)">
              <LoaderCircle className="animate-spin" size={18} />
              Loading profile...
            </p>
          </div>
        ) : error ? (
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
        ) : !user ? (
          <Card className="p-6">
            <p className="text-sm text-(--muted)">No profile found.</p>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card className="p-6 sm:p-8 border border-(--border) bg-(--surface) shadow-xs">
              {/* Header Identity Bar */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-(--border) pb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--primary-soft) text-xl font-extrabold text-(--primary-strong)">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-(--foreground)">
                        {user.username}
                      </h2>
                      <Badge tone={user.role === "teacher" ? "blue" : "green"}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-(--muted)">
                      ID: {user._id || "Local User"}
                    </p>
                  </div>
                </div>

                {/* Right-aligned Equal Action Buttons */}
                <div className="grid w-full grid-cols-1 gap-2.5 sm:w-48">
                  <Link href={`/user/profile/update/${user._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-(--primary-strong)"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
                      <PencilLine
                        size={16}
                        className="transition-transform duration-200 group-hover:scale-110"
                      />
                      <span>Edit profile</span>
                    </motion.button>
                  </Link>

                  <Link href="/user/change-password">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-(--border) bg-(--surface-muted) px-4 py-2.5 text-sm font-bold text-(--foreground) shadow-xs transition-colors hover:border-(--primary-soft) hover:bg-(--surface)"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
                      <KeyRound
                        size={16}
                        className="text-(--muted) transition-colors duration-200 group-hover:text-(--primary-strong)"
                      />
                      <span>Change password</span>
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Account Details Overview */}
              <dl className="mt-6 divide-y divide-(--border)">
                <div className="flex items-center justify-between py-3.5">
                  <dt className="flex items-center gap-2 text-sm text-(--muted)">
                    <User size={16} />
                    Username
                  </dt>
                  <dd className="text-sm font-semibold text-(--foreground)">
                    {user.username}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <dt className="flex items-center gap-2 text-sm text-(--muted)">
                    <ShieldCheck size={16} />
                    Account Role
                  </dt>
                  <dd className="text-sm font-semibold capitalize text-(--foreground)">
                    {user.role}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <dt className="flex items-center gap-2 text-sm text-(--muted)">
                    <Calendar size={16} />
                    Member Since
                  </dt>
                  <dd className="text-sm font-semibold text-(--foreground)">
                    {formatDate(user.createdAt)}
                  </dd>
                </div>
              </dl>

              {/* Sign Out Action at the end, right-aligned */}
              <div className="mt-6 flex justify-end border-t border-(--border) pt-6">
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="group relative flex w-full sm:w-48 items-center justify-center gap-2 overflow-hidden rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 shadow-xs transition-colors hover:bg-rose-500 hover:text-white disabled:opacity-60"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
                  {loggingOut ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    <LogOut
                      size={16}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                  )}
                  <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
                </motion.button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
"use client";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  BookText,
  Calendar,
  CheckCheck,
  Flame,
  GraduationCap,
  LoaderCircle,
  Mail,
  MapPin,
  PencilLine,
  Save,
  School,
  Timer,
  X,
} from "lucide-react";
import { Manrope } from "next/font/google";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import AppShell from "@/components/AppShell";
import { getProfile } from "@/lib/frontend-data";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";

type UserRole = "student" | "teacher";

type UserProfileResponse = {
  _id?: string;
  username: string;
  role: UserRole;
  email?: string;
  createdAt?: string;
};

type PlannerProfile = {
  fullName: string;
  email: string;
  bio: string;
  institution: string;
  program: string;
  semester: string;
  city: string;
  timezone: string;
  dailyStudyGoalHours: string;
  preferredStudyWindow: string;
  focusSessionMinutes: string;
  shortBreakMinutes: string;
  weeklyTargetDays: string;
};

const defaultPlannerProfile: PlannerProfile = {
  fullName: "",
  email: "",
  bio: "",
  institution: "",
  program: "",
  semester: "",
  city: "",
  timezone: "Asia/Kolkata",
  dailyStudyGoalHours: "2",
  preferredStudyWindow: "Evening",
  focusSessionMinutes: "45",
  shortBreakMinutes: "10",
  weeklyTargetDays: "5",
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-profile",
});

const pageTheme = {
  "--profile-bg": "#09090b",
  "--profile-surface": "rgba(24, 24, 27, 0.8)",
  "--profile-ink": "#f4f4f5",
  "--profile-muted": "#a1a1aa",
  "--profile-line": "#27272a",
  "--profile-accent": "#a78bfa",
  "--profile-accent-soft": "rgba(139, 92, 246, 0.14)",
} as CSSProperties;

const mockAcademicStats = {
  activeSubjects: 6,
  completedTasksThisWeek: 14,
  studyHoursThisWeek: 11.5,
  upcomingExams: 2,
};

const mockRecentActivity = [
  {
    id: "a1",
    title: "Completed Problem Set 4",
    detail: "Algorithms",
    time: "Today, 08:30 PM",
  },
  {
    id: "a2",
    title: "Logged 90-minute deep work session",
    detail: "Database Systems",
    time: "Yesterday, 06:10 PM",
  },
  {
    id: "a3",
    title: "Updated revision checklist",
    detail: "Linear Algebra",
    time: "Yesterday, 10:40 AM",
  },
];

const makeStorageKey = (username: string) =>
  `study-planner:profile:${username}`;

const formatDate = (value?: string) => {
  if (!value) {
    return "Not available";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [plannerProfile, setPlannerProfile] = useState<PlannerProfile>(
    defaultPlannerProfile,
  );
  const [draftProfile, setDraftProfile] = useState<PlannerProfile>(
    defaultPlannerProfile,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [isReady, setIsReady] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const tick = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfile<UserProfileResponse>();
        const fetchedUser = data.user;
        setUser(fetchedUser);

        const stored = window.localStorage.getItem(
          makeStorageKey(fetchedUser.username),
        );
        const storedPreferences = stored
          ? (JSON.parse(stored) as Partial<PlannerProfile>)
          : {};

        const mergedProfile: PlannerProfile = {
          ...defaultPlannerProfile,
          fullName: fetchedUser.username,
          email: fetchedUser.email ?? "",
          bio: "Building consistency one focused study block at a time.",
          ...storedPreferences,
        };

        setPlannerProfile(mergedProfile);
        setDraftProfile(mergedProfile);
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

  const completion = useMemo(() => {
    const required: Array<keyof PlannerProfile> = [
      "fullName",
      "email",
      "bio",
      "institution",
      "program",
      "timezone",
      "dailyStudyGoalHours",
      "focusSessionMinutes",
    ];
    const filled = required.filter(
      (item) => plannerProfile[item].trim().length > 0,
    ).length;
    return Math.round((filled / required.length) * 100);
  }, [plannerProfile]);

  const studyGoal = Number.parseInt(
    plannerProfile.dailyStudyGoalHours || "0",
    10,
  );
  const focusCycle =
    Number.parseInt(plannerProfile.focusSessionMinutes || "0", 10) +
    Number.parseInt(plannerProfile.shortBreakMinutes || "0", 10);

  const initials = useMemo(() => {
    const source = plannerProfile.fullName || user?.username || "SP";
    const parts = source.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (parts.length === 0) {
      return "SP";
    }
    return parts.map((item) => item[0]?.toUpperCase() ?? "").join("");
  }, [plannerProfile.fullName, user?.username]);

  const openEditor = () => {
    setDraftProfile(plannerProfile);
    setEditing(true);
  };

  const handleDraftChange = (field: keyof PlannerProfile, value: string) => {
    setDraftProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveDraft = () => {
    setPlannerProfile(draftProfile);
    setEditing(false);
    setSaveState("idle");
  };

  const handleSavePreferences = () => {
    if (!user) {
      return;
    }
    window.localStorage.setItem(
      makeStorageKey(user.username),
      JSON.stringify(plannerProfile),
    );
    setSaveState("saved");
  };

  return (
    <AppShell>
      <div style={pageTheme} className={manrope.className}>
        <PageHeader
          eyebrow="Profile"
          title="Personal Study Identity"
          description="A focused overview of who you are academically, what progress looks like right now, and what to refine next."
        />

        {loading ? (
          <div className="flex min-h-[52vh] items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
            <p className="flex items-center gap-2 text-sm font-semibold text-(--profile-muted)">
              <LoaderCircle className="animate-spin" size={18} />
              Loading profile...
            </p>
          </div>
        ) : error ? (
          <Card className="border-rose-500/30 bg-rose-500/10 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 text-[#a85a55]" size={20} />
              <div>
                <p className="text-sm font-bold text-rose-200">
                  Could not load profile
                </p>
                <p className="mt-1 text-sm text-rose-300">{error}</p>
              </div>
            </div>
          </Card>
        ) : !user ? (
          <Card className="p-6">
            <p className="text-sm text-(--profile-muted)">No profile found.</p>
          </Card>
        ) : (
          <div className="space-y-8">
            <section
              className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-(--shadow-card) dark:hover:border-zinc-700 sm:p-8 ${isReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
            >
              <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-start">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="group relative h-24 w-24 overflow-hidden rounded-xl border border-violet-400/30 bg-violet-500/15 p-px">
                    <div className="flex h-full w-full items-center justify-center rounded-[0.65rem] bg-violet-100 text-3xl font-bold tracking-[-0.02em] text-violet-700 transition duration-300 group-hover:scale-[1.04] dark:bg-zinc-950 dark:text-violet-200">
                      {initials}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-3xl font-extrabold tracking-[-0.04em] text-(--profile-ink)">
                        {plannerProfile.fullName || user.username}
                      </h2>
                      <Badge tone="green">{user.role}</Badge>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-(--profile-muted)">
                      <Mail size={14} />
                      {plannerProfile.email || "No email saved"}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-(--profile-muted)">
                      {plannerProfile.bio ||
                        "A thoughtful planner who learns in structured blocks and builds progress one session at a time."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Tag
                        icon={<School size={13} />}
                        value={plannerProfile.institution || "Institution"}
                      />
                      <Tag
                        icon={<BookText size={13} />}
                        value={plannerProfile.program || "Program"}
                      />
                      <Tag
                        icon={<MapPin size={13} />}
                        value={plannerProfile.city || "City"}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button className="min-w-36" onClick={openEditor}>
                    <PencilLine size={16} />
                    Edit profile
                  </Button>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--profile-muted)">
                      Profile completeness
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-(--profile-ink)">
                      {completion}%
                    </p>
                    <div className="mt-3 h-1.5 rounded-full bg-[#e8ece8]">
                      <div
                        className="h-full rounded-full bg-(--profile-accent) transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <Card
                className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-700 delay-75 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-(--shadow-card) dark:hover:border-zinc-700 ${isReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-(--profile-ink)">
                    Academic Overview
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-(--profile-muted)">
                    This week
                  </span>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--profile-muted)">
                      Focused study
                    </p>
                    <p className="mt-2 text-4xl font-extrabold tracking-tighter text-(--profile-ink)">
                      {mockAcademicStats.studyHoursThisWeek}
                      <span className="ml-1 text-lg font-semibold">hrs</span>
                    </p>
                    <p className="mt-2 text-sm text-(--profile-muted)">
                      {studyGoal > 0
                        ? `Goal pacing: ${Math.min(100, Math.round((mockAcademicStats.studyHoursThisWeek / (studyGoal * 7)) * 100))}% of weekly target`
                        : "Set a daily goal for pacing insights."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <MiniMetric
                      icon={<BookOpen size={15} />}
                      label="Subjects"
                      value={`${mockAcademicStats.activeSubjects}`}
                    />
                    <MiniMetric
                      icon={<CheckCheck size={15} />}
                      label="Tasks done"
                      value={`${mockAcademicStats.completedTasksThisWeek}`}
                    />
                    <MiniMetric
                      icon={<GraduationCap size={15} />}
                      label="Upcoming exams"
                      value={`${mockAcademicStats.upcomingExams}`}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <InfoBlock
                    icon={<Calendar size={15} />}
                    title="Preferred study window"
                    value={plannerProfile.preferredStudyWindow}
                  />
                  <InfoBlock
                    icon={<Timer size={15} />}
                    title="Session rhythm"
                    value={`${plannerProfile.focusSessionMinutes}/${plannerProfile.shortBreakMinutes} min`}
                  />
                </div>
              </Card>

              <Card
                className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-700 delay-150 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-(--shadow-card) dark:hover:border-zinc-700 ${isReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-(--profile-ink)">
                    Account Details
                  </h3>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-(--profile-accent) transition hover:opacity-80"
                    onClick={openEditor}
                  >
                    Update
                    <ArrowRight size={15} />
                  </button>
                </div>
                <dl className="mt-5 divide-y divide-zinc-800/50">
                  <ProfileRow label="Username" value={user.username} />
                  <ProfileRow label="Role" value={user.role} />
                  <ProfileRow
                    label="Member since"
                    value={formatDate(user.createdAt)}
                  />
                  <ProfileRow
                    label="Timezone"
                    value={plannerProfile.timezone}
                  />
                  <ProfileRow
                    label="Semester"
                    value={plannerProfile.semester || "Not set"}
                  />
                </dl>
                <div className="mt-5 rounded-lg border border-violet-400/20 bg-violet-500/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
                    Daily target
                  </p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {plannerProfile.dailyStudyGoalHours}h planned with a{" "}
                    {focusCycle}-minute cycle
                  </p>
                </div>
              </Card>
            </div>

            <Card
              className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-700 delay-200 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-(--shadow-card) dark:hover:border-zinc-700 ${isReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold tracking-[-0.02em] text-(--profile-ink)">
                  Recent Study Activity
                </h3>
                <Badge tone="neutral">Last 48 hours</Badge>
              </div>
              <div className="mt-5 divide-y divide-zinc-800/50">
                {mockRecentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 px-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                      <Flame size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-(--profile-ink)">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-(--profile-muted)">
                        {item.detail}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-(--profile-muted)">
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex items-center justify-between rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
              <p className="text-xs text-(--profile-muted)">
                {saveState === "saved"
                  ? "Preferences saved locally on this device."
                  : "Profile edits are local until saved in your account settings backend."}
              </p>
              <Button variant="secondary" onClick={handleSavePreferences}>
                <Save size={16} />
                Save local snapshot
              </Button>
            </div>

            {editing && (
              <div
                className="fixed inset-0 z-40 bg-[#0f1f19]/35"
                onClick={() => setEditing(false)}
              >
                <aside
                  className="ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--profile-muted)">
                        Edit
                      </p>
                      <h4 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-(--profile-ink)">
                        Profile Details
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      aria-label="Close profile editor"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSaveDraft();
                    }}
                    className="space-y-4"
                  >
                    <Field label="Full name">
                      <Input
                        required
                        value={draftProfile.fullName}
                        onChange={(event) =>
                          handleDraftChange("fullName", event.target.value)
                        }
                        placeholder="Your full name"
                      />
                    </Field>

                    <Field label="Email">
                      <Input
                        required
                        type="email"
                        value={draftProfile.email}
                        onChange={(event) =>
                          handleDraftChange("email", event.target.value)
                        }
                        placeholder="name@example.com"
                      />
                    </Field>

                    <Field
                      label="Bio"
                      hint="Short line about your study style or priorities."
                    >
                      <textarea
                        value={draftProfile.bio}
                        onChange={(event) =>
                          handleDraftChange("bio", event.target.value)
                        }
                        rows={4}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                        placeholder="Example: I focus best in evening blocks and review concepts right after class."
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Institution">
                        <Input
                          value={draftProfile.institution}
                          onChange={(event) =>
                            handleDraftChange("institution", event.target.value)
                          }
                          placeholder="University or school"
                        />
                      </Field>

                      <Field label="Program">
                        <Input
                          value={draftProfile.program}
                          onChange={(event) =>
                            handleDraftChange("program", event.target.value)
                          }
                          placeholder="Program name"
                        />
                      </Field>

                      <Field label="Semester">
                        <Input
                          value={draftProfile.semester}
                          onChange={(event) =>
                            handleDraftChange("semester", event.target.value)
                          }
                          placeholder="Semester 5"
                        />
                      </Field>

                      <Field label="City">
                        <Input
                          value={draftProfile.city}
                          onChange={(event) =>
                            handleDraftChange("city", event.target.value)
                          }
                          placeholder="Your city"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Timezone">
                        <Select
                          value={draftProfile.timezone}
                          onChange={(event) =>
                            handleDraftChange("timezone", event.target.value)
                          }
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata</option>
                          <option value="Asia/Dubai">Asia/Dubai</option>
                          <option value="Europe/London">Europe/London</option>
                          <option value="America/New_York">
                            America/New_York
                          </option>
                          <option value="America/Los_Angeles">
                            America/Los_Angeles
                          </option>
                        </Select>
                      </Field>

                      <Field label="Daily goal (hours)">
                        <Select
                          value={draftProfile.dailyStudyGoalHours}
                          onChange={(event) =>
                            handleDraftChange(
                              "dailyStudyGoalHours",
                              event.target.value,
                            )
                          }
                        >
                          <option value="1">1 hour</option>
                          <option value="2">2 hours</option>
                          <option value="3">3 hours</option>
                          <option value="4">4 hours</option>
                          <option value="5">5 hours</option>
                          <option value="6">6 hours</option>
                        </Select>
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Focus session">
                        <Select
                          value={draftProfile.focusSessionMinutes}
                          onChange={(event) =>
                            handleDraftChange(
                              "focusSessionMinutes",
                              event.target.value,
                            )
                          }
                        >
                          <option value="25">25 min</option>
                          <option value="40">40 min</option>
                          <option value="45">45 min</option>
                          <option value="50">50 min</option>
                          <option value="60">60 min</option>
                        </Select>
                      </Field>

                      <Field label="Break">
                        <Select
                          value={draftProfile.shortBreakMinutes}
                          onChange={(event) =>
                            handleDraftChange(
                              "shortBreakMinutes",
                              event.target.value,
                            )
                          }
                        >
                          <option value="5">5 min</option>
                          <option value="10">10 min</option>
                          <option value="15">15 min</option>
                        </Select>
                      </Field>

                      <Field label="Target days">
                        <Select
                          value={draftProfile.weeklyTargetDays}
                          onChange={(event) =>
                            handleDraftChange(
                              "weeklyTargetDays",
                              event.target.value,
                            )
                          }
                        >
                          <option value="4">4 days</option>
                          <option value="5">5 days</option>
                          <option value="6">6 days</option>
                          <option value="7">7 days</option>
                        </Select>
                      </Field>
                    </div>

                    <Field label="Preferred study window">
                      <Select
                        value={draftProfile.preferredStudyWindow}
                        onChange={(event) =>
                          handleDraftChange(
                            "preferredStudyWindow",
                            event.target.value,
                          )
                        }
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Late night">Late night</option>
                        <option value="Flexible">Flexible</option>
                      </Select>
                    </Field>

                    <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save size={16} />
                        Save profile
                      </Button>
                    </div>
                  </form>
                </aside>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-zinc-600 dark:text-zinc-400">{label}</dt>
      <dd className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

function Tag({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
      {icon}
      {value}
    </span>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-40 items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/60">
      <span className="inline-flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
          {icon}
        </span>
        {label}
      </span>
      <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

function InfoBlock({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">
        {icon}
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}

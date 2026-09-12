import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const cn = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles = {
    primary:
      "bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-white shadow-[0_10px_20px_rgba(20,89,230,0.28)] hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(20,89,230,0.34)]",
    secondary:
      "border border-(--border) bg-white text-foreground shadow-[0_4px_12px_rgba(9,28,68,0.05)] hover:bg-(--surface-muted)",
    ghost:
      "text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[varforeground]",
    danger:
      "bg-[linear-gradient(135deg,var(--danger),#c03e57)] text-white shadow-[0_10px_20px_rgba(210,76,102,0.24)] hover:translate-y-[-1px] hover:shadow-[0_14px_28px_rgba(210,76,102,0.3)]",
  };
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold tracking-[-0.01em] transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      {...props}
      className={cn(
        "rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow-card)",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red";
}) {
  const tones = {
    neutral: "bg-[#eef3ff] text-[#4b5c87]",
    blue: "bg-[var(--primary-soft)] text-[var(--primary-strong)]",
    green: "bg-[var(--support-soft)] text-[#0b7e7c]",
    amber: "bg-[#e8f9f8] text-[#0f7b79]",
    red: "bg-[var(--danger-soft)] text-[var(--danger)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-(--border) bg-white px-3 text-sm text-foreground outline-none placeholder:text-[#8c9ab7] focus:border-(--primary) focus:ring-2 focus:ring-[rgba(20,89,230,0.18)]",
        props.className,
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-(--border) bg-white px-3 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-[rgba(20,89,230,0.18)]",
        props.className,
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-xl border border-(--border) bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-[#8c9ab7] focus:border-(--primary) focus:ring-2 focus:ring-[rgba(20,89,230,0.18)]",
        props.className,
      )}
    />
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
      <span className="tracking-[-0.01em]">{label}</span>
      {children}
      {hint && (
        <span className="text-xs font-normal text-(--muted)">{hint}</span>
      )}
    </label>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-(--primary)">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-[2.1rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--muted) sm:text-[0.95rem]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

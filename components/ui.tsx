import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { motion } from "motion/react";

const cn = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const { onDrag, onDragEnd, ...buttonProps } = props;
  void onDrag;
  void onDragEnd;
  const styles = {
    primary:
      "bg-(--primary) text-white shadow-md hover:opacity-90",
    secondary:
      "border border-(--border) bg-(--surface) text-(--foreground) shadow-xs hover:bg-(--surface-muted)",
    ghost:
      "text-(--muted) hover:bg-(--surface-muted) hover:text-(--foreground)",
    danger:
      "bg-(--danger) text-white shadow-md hover:opacity-90",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...(buttonProps as Record<string, unknown>)}
    />
  );
}

export function Card({
  children,
  className = "",
  style,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      {...props}
      style={style}
      className={cn(
        "rounded-xl border border-(--border) bg-(--surface) text-(--foreground) shadow-xs backdrop-blur-sm",
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
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red" | "emerald";
  className?: string;
}) {
  const tones = {
    neutral: "bg-(--surface-muted) text-(--muted)",
    blue: "bg-violet-500/15 text-(--primary-strong)",
    green: "bg-emerald-500/15 text-(--support)",
    emerald: "bg-emerald-500/15 text-(--support)",
    amber: "bg-amber-500/15 text-(--amber)",
    red: "bg-rose-500/15 text-(--danger)",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
        className,
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
        "h-11 w-full rounded-lg border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none placeholder:text-(--muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary-soft)",
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
        "h-11 w-full rounded-lg border border-(--border) bg-(--surface) px-3 text-sm text-(--foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--primary-soft)",
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
        "min-h-28 w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--foreground) outline-none placeholder:text-(--muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary-soft)",
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
    <label className="flex flex-col gap-2 text-sm font-semibold text-(--foreground)">
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-(--primary-strong)">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-(--foreground) sm:text-[2.1rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--muted) sm:text-[0.95rem]">
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
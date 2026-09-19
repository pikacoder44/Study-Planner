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
      "bg-violet-500 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400",
    secondary:
      "border border-zinc-800 bg-zinc-900/70 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800",
    ghost: "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
    danger:
      "bg-rose-500 text-white shadow-lg shadow-rose-950/30 hover:bg-rose-400",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:cursor-not-allowed disabled:opacity-50",
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
        "rounded-xl border border-zinc-800/80 bg-zinc-900/60 shadow-(--shadow-card) backdrop-blur-sm",
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
    neutral: "bg-zinc-800 text-zinc-300",
    blue: "bg-violet-500/15 text-violet-300",
    green: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
    red: "bg-rose-500/15 text-rose-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
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
        "h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-foreground outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
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
        "h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-foreground outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
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
        "min-h-28 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-400">
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
    </motion.div>
  );
}

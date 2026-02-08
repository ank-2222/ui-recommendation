import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type InfoNoteProps = {
  children: React.ReactNode;
  className?: string;
};

export function InfoNote({ children, className }: InfoNoteProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-lg border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200",
        className
      )}
    >
      <Info className="size-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

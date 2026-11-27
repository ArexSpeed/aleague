"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type LinkSelectOption = { value: string; label: string; href: string };

type LinkSelectProps = {
  /** Accessible name of the select. */
  label: string;
  value: string;
  options: readonly LinkSelectOption[];
};

/** Select whose options are links: picking one navigates, so the choice lives in the URL. */
export function LinkSelect({ label, value, options }: LinkSelectProps) {
  const router = useRouter();
  const selected = options.find((option) => option.value === value);

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const option = options.find((item) => item.value === next);
        if (option) router.replace(option.href, { scroll: false });
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={label}
        className="min-w-24 border-line bg-surface text-xs font-bold text-fg"
      >
        <SelectValue>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="end" className="bg-surface text-fg ring-line">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs font-bold focus:bg-surface-hover focus:text-fg"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
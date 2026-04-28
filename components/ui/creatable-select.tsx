"use client";

import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CreatableSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  addButtonLabel?: string;
  emptyMessage?: string;
  className?: string;
  onOptionsChange?: (options: string[]) => void;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function uniqueOptions(options: string[]) {
  const seen = new Set<string>();

  return options.filter((option) => {
    const key = normalize(option);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function CreatableSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search or add category",
  addButtonLabel = "Add",
  emptyMessage = "No categories yet. Add one from the input above.",
  className,
  onOptionsChange,
}: CreatableSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const baseOptionKeys = useMemo(
    () => new Set(uniqueOptions(options).map((option) => normalize(option))),
    [options],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [availableOptions, setAvailableOptions] = useState(() => {
    const seed = uniqueOptions(options);

    if (value.trim() && !seed.some((option) => normalize(option) === normalize(value))) {
      seed.push(value.trim());
    }

    return seed;
  });

  useEffect(() => {
    const nextOptions = uniqueOptions(options);

    setAvailableOptions((current) => {
      const custom = current.filter((option) => !baseOptionKeys.has(normalize(option)));
      const merged = uniqueOptions([...nextOptions, ...custom]);

      if (value.trim() && !merged.some((option) => normalize(option) === normalize(value))) {
        merged.push(value.trim());
      }

      return merged;
    });
  }, [options, value, baseOptionKeys]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return availableOptions;
    }

    return availableOptions.filter((option) => normalize(option).includes(normalizedQuery));
  }, [availableOptions, query]);

  const canAdd = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return false;
    }

    return !availableOptions.some((option) => normalize(option) === normalizedQuery);
  }, [availableOptions, query]);

  function handleSelect(option: string) {
    onChange(option);
    setIsOpen(false);
    setQuery("");
  }

  function handleAddOption() {
    const nextOption = query.trim();

    if (!nextOption || !canAdd) {
      return;
    }

    setAvailableOptions((current) => {
      const nextOptions = uniqueOptions([...current, nextOption]);
      onOptionsChange?.(nextOptions);
      return nextOptions;
    });

    onChange(nextOption);
    setQuery("");
    setIsOpen(false);
  }

  function handleDeleteOption(optionToDelete: string) {
    setAvailableOptions((current) => {
      const nextOptions = current.filter((option) => option !== optionToDelete);
      onOptionsChange?.(nextOptions);

      if (normalize(value) === normalize(optionToDelete)) {
        onChange(nextOptions[0] ?? "");
      }

      return nextOptions;
    });
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100",
          isOpen && "border-sky-400 ring-4 ring-sky-100",
        )}
      >
        <span className={cn(!value && "text-slate-400")}>{value || placeholder}</span>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddOption();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  setIsOpen(false);
                }
              }}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={handleAddOption}
              disabled={!canAdd}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {addButtonLabel}
            </button>
          </div>

          <div className="mt-3 max-h-56 overflow-auto rounded-xl border border-slate-100">
            {filteredOptions.length ? (
              <ul className="divide-y divide-slate-100">
                {filteredOptions.map((option) => {
                  const isSelected = normalize(value) === normalize(option);
                  const isRemovable = !baseOptionKeys.has(normalize(option));

                  return (
                    <li key={option} className="flex items-center justify-between px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelect(option)}
                        className={cn(
                          "inline-flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-700 transition hover:bg-slate-100",
                          isSelected && "bg-sky-50 text-sky-700",
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 text-sky-600 transition-opacity",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span>{option}</span>
                      </button>

                      {isRemovable ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(option)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${option}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-3 py-4 text-sm text-slate-500">{emptyMessage}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
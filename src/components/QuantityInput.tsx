import { Minus, Plus } from "lucide-react";
import React from "react";

export type QuantityInputProps = {
  value: number | string;
  onChange: (value: number | string) => void;
  min?: number;
  max?: number;
  onBlur?: () => void;
  onEnter?: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function QuantityInput({
  value,
  onChange,
  min = 0,
  max,
  onBlur,
  onEnter,
  disabled,
  className = "",
  id,
}: QuantityInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") onChange("");
    else {
      const num = Number(val);
      if (!Number.isNaN(num)) onChange(num);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(typeof value === "number" ? Math.max(min, value - 1) : min);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(
      typeof value === "number"
        ? max
          ? Math.min(max, value + 1)
          : value + 1
        : min + 1,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div
      className={
        "flex w-fit items-stretch [&>input]:flex-1 [&>button]:focus-visible:z-10 [&>button]:focus-visible:relative [&>input]:w-14 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2 [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none " +
        className
      }
    >
      <button
        data-slot="button"
        type="button"
        aria-label="Decrement"
        onClick={handleDecrement}
        tabIndex={-1}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-8"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        id={id}
        min={min}
        max={max}
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={handleInputChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input  min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 !w-14 font-mono text-center"
        style={{ appearance: "textfield" }}
        data-slot="input"
      />
      <button
        data-slot="button"
        type="button"
        aria-label="Increment"
        onClick={handleIncrement}
        tabIndex={-1}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-8"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

import { motion } from "framer-motion";

export type StatusFilter = "all" | "enabled" | "disabled";
export function FilterBar({
  value,
  onChange,
  counts,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  counts?: { all: number; enabled: number; disabled: number };
}) {
  const options: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Все источники" },
    { key: "enabled", label: "Включены" },
    { key: "disabled", label: "Выключены" },
  ];
  return (
    <div className="filter-tabs" role="group" aria-label="Фильтр по статусу">
      {options.map((option) => (
        <button
          key={option.key}
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
          className={value === option.key ? "selected" : ""}
        >
          {value === option.key && (
            <motion.span
              layoutId="filter-tab"
              className="tab-highlight"
              transition={{ duration: 0.18 }}
            />
          )}
          <span>{option.label}</span>
          {counts && <span className="tab-count">{counts[option.key]}</span>}
        </button>
      ))}
    </div>
  );
}

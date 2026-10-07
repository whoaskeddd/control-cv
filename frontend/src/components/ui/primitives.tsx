import type { HTMLAttributes, ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, CircleAlert, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

export function GlassCard({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`glass-card ${className}`} {...props}>
      {children}
    </section>
  );
}
export function BentoCard({
  children,
  className = "",
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.section
      className={`glass-card bento-card ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--pointer-x",
          `${event.clientX - box.left}px`,
        );
        event.currentTarget.style.setProperty(
          "--pointer-y",
          `${event.clientY - box.top}px`,
        );
      }}
    >
      {children}
    </motion.section>
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
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 tabIndex={-1}>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}
export function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span className={`status-badge ${enabled ? "enabled" : ""}`}>
      <span className="status-dot" />
      {enabled ? "Включён" : "Выключен"}
    </span>
  );
}
export function SectionHeader({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {detail && <span>{detail}</span>}
    </div>
  );
}
export function MetricCard({
  label,
  value,
  detail,
  icon,
  index,
  active = false,
}: {
  label: string;
  value: number | undefined;
  detail: string;
  icon: ReactNode;
  index: number;
  active?: boolean;
}) {
  return (
    <BentoCard
      index={index}
      className={`metric-card ${active ? "metric-active" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        {icon}
      </div>
      <div className="metric-value">
        {value ?? "—"}
        <span>{active ? "в системе" : "источников"}</span>
      </div>
      <div className="metric-detail">{detail}</div>
    </BentoCard>
  );
}
export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="search-input">
      <Search size={18} />
      <input
        aria-label="Поиск источников"
        placeholder="Поиск по названию или локации"
        value={value}
        maxLength={255}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="icon-button"
          aria-label="Очистить поиск"
          onClick={() => onChange("")}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
export function EmptyState({
  filtered = false,
  reset,
}: {
  filtered?: boolean;
  reset?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Camera size={30} strokeWidth={1.4} />
      </div>
      <h2>{filtered ? "Ничего не найдено" : "Начните с первой камеры"}</h2>
      <p>
        {filtered
          ? "Попробуйте другое название, локацию или измените фильтры."
          : "Добавьте источник видеопотока, чтобы управлять его параметрами и состоянием."}
      </p>
      {filtered ? (
        <button className="button secondary" onClick={reset}>
          Сбросить фильтры
        </button>
      ) : (
        <Link className="button primary" to="/sources/new">
          Добавить источник
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function ErrorState({
  error,
  retry,
}: {
  error: Error | null;
  retry?: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <CircleAlert size={24} />
      <h2>Не удалось загрузить данные</h2>
      <p>{error?.message || "Источник не найден."}</p>
      {retry && (
        <button className="button secondary" onClick={retry}>
          Повторить запрос
        </button>
      )}
      <Link to="/sources" className="text-link">
        К списку источников
      </Link>
    </div>
  );
}
export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="loading-skeleton"
      role="status"
      aria-label="Загрузка источников"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          className="skeleton-row"
          key={index}
          style={{ "--index": index } as CSSProperties}
        >
          <span className="skeleton skeleton-icon" />
          <span className="skeleton skeleton-wide" />
          <span className="skeleton skeleton-small" />
        </div>
      ))}
    </div>
  );
}

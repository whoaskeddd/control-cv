import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDownUp,
  Camera,
  ChevronLeft,
  ChevronRight,
  CirclePause,
  MapPin,
  Plus,
  Power,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useSources } from "../hooks/useSources";
import { useDebounce } from "../hooks/useDebounce";
import {
  EmptyState,
  ErrorState,
  GlassCard,
  LoadingSkeleton,
  MetricCard,
  PageHeader,
  SearchInput,
  StatusBadge,
} from "../components/ui/primitives";
import { FilterBar, type StatusFilter } from "../components/ui/FilterBar";
import { DataTable } from "../components/ui/DataTable";
import { SourceActions } from "../features/sources/SourceActions";
import { safeUrl } from "../utils/format";

const pageSize = 8;
export function SourcesPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const search = params.get("search") || "";
  const debounced = useDebounce(search.trim());
  const status: StatusFilter =
    params.get("status") === "enabled"
      ? "enabled"
      : params.get("status") === "disabled"
        ? "disabled"
        : "all";
  const location = params.get("location") || "";
  const sort = params.get("sort") || "newest";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const query = useSources(debounced);
  const allQuery = useSources();
  function change(key: string, value: string) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page");
        return next;
      },
      { replace: key === "search" },
    );
  }
  const all = allQuery.data;
  const counts = all
    ? {
        all: all.length,
        enabled: all.filter((item) => item.enabled).length,
        disabled: all.filter((item) => !item.enabled).length,
      }
    : undefined;
  const locations = [...new Set(all?.map((item) => item.location))].sort(
    (a, b) => a.localeCompare(b, "ru"),
  );
  const filtered = (query.data || []).filter(
    (item) =>
      (status === "all" || item.enabled === (status === "enabled")) &&
      (!location || item.location === location),
  );
  filtered.sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name, "ru") || a.id - b.id
      : sort === "oldest"
        ? a.id - b.id
        : b.id - a.id,
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const filtering = Boolean(search || status !== "all" || location);
  return (
    <>
      <PageHeader
        eyebrow="ПАНЕЛЬ УПРАВЛЕНИЯ"
        title="Источники видео"
        description="Камеры, локации и параметры подключения — в одном месте."
        action={
          <Link to="/sources/new" className="button primary">
            <Plus size={18} />
            Добавить источник
          </Link>
        }
      />
      <div className="overview-grid">
        <MetricCard
          label="Всего источников"
          value={counts?.all}
          detail="В вашем рабочем пространстве"
          icon={<Camera size={20} />}
          index={0}
        />
        <MetricCard
          label="Включены"
          value={counts?.enabled}
          detail="Участвуют в системе"
          icon={<Power size={20} />}
          index={1}
          active
        />
        <MetricCard
          label="Выключены"
          value={counts?.disabled}
          detail="Можно включить в любой момент"
          icon={<CirclePause size={20} />}
          index={2}
        />
    
      </div>
      <GlassCard className="sources-panel">
        <div className="panel-title-row">
          <div>
            <h2>Ваши источники</h2>
            <span className="subtle">
              Управляйте параметрами и состоянием камер
            </span>
          </div>
          <button
            className="icon-button"
            aria-label="Обновить источники"
            title="Обновить"
            disabled={query.isFetching}
            onClick={() => {
              void query.refetch();
              if (debounced) void allQuery.refetch();
            }}
          >
            <RefreshCw
              size={17}
              className={query.isFetching ? "refreshing" : ""}
            />
          </button>
        </div>
        <div className="table-toolbar">
          <FilterBar
            value={status}
            onChange={(value) => change("status", value === "all" ? "" : value)}
            counts={counts}
          />
          <div className="table-tools">
            <SearchInput
              value={search}
              onChange={(value) => change("search", value)}
            />
            <button
              className={`filter-button icon-button ${filtersOpen || location ? "filter-active" : ""}`}
              title="Фильтры и сортировка"
              aria-label="Фильтры и сортировка"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
        {filtersOpen && (
          <div className="extra-filters">
            <label>
              Локация
              <select
                value={location}
                onChange={(event) => change("location", event.target.value)}
              >
                <option value="">Все локации</option>
                {locations.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Сортировка
              <select
                value={sort}
                onChange={(event) => change("sort", event.target.value)}
              >
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
                <option value="name">По названию А–Я</option>
              </select>
            </label>
            <button className="text-link" onClick={() => setParams({})}>
              Сбросить
            </button>
          </div>
        )}
        <div aria-busy={query.isFetching || search.trim() !== debounced}>
          {query.isPending || search.trim() !== debounced ? (
            <LoadingSkeleton />
          ) : query.isError ? (
            <ErrorState
              error={query.error}
              retry={() => {
                void query.refetch();
              }}
            />
          ) : visible.length === 0 ? (
            <EmptyState filtered={filtering} reset={() => setParams({})} />
          ) : (
            <DataTable
              headings={[
                {
                  key: "name",
                  label: (
                    <button
                      className="sort-heading"
                      onClick={() =>
                        change("sort", sort === "name" ? "newest" : "name")
                      }
                    >
                      Название
                      <ArrowDownUp size={12} />
                    </button>
                  ),
                },
                { key: "url", label: "URL видеопотока" },
                { key: "location", label: "Локация" },
                { key: "status", label: "Статус" },
                { key: "actions", label: "Действия" },
              ]}
            >
              {visible.map((source) => (
                <tr key={source.id}>
                  <td>
                    <Link className="source-name" to={`/sources/${source.id}`}>
                      <span
                        className={`camera-tile ${source.enabled ? "camera-enabled" : ""}`}
                      >
                        <Camera size={18} strokeWidth={1.6} />
                      </span>
                      <span>
                        <strong>{source.name}</strong>
                        <small>CAM–{String(source.id).padStart(3, "0")}</small>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <span className="stream-url" title={safeUrl(source.url)}>
                      {safeUrl(source.url)}
                    </span>
                  </td>
                  <td>
                    <span className="location-label">
                      <MapPin size={14} />
                      {source.location}
                    </span>
                  </td>
                  <td>
                    <StatusBadge enabled={source.enabled} />
                  </td>
                  <td>
                    <SourceActions source={source} />
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
        <div className="table-footer">
          <span>
            {query.isSuccess
              ? `Показано ${visible.length ? (currentPage - 1) * pageSize + 1 : 0}–${Math.min(currentPage * pageSize, filtered.length)} из ${filtered.length}`
              : "Источники видео"}
          </span>
          <div className="pagination">
            <button
              className="icon-button"
              aria-label="Предыдущая страница"
              disabled={currentPage <= 1 || query.isPending}
              onClick={() => change("page", String(currentPage - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {currentPage} <span className="subtle">/ {pageCount}</span>
            </span>
            <button
              className="icon-button"
              aria-label="Следующая страница"
              disabled={currentPage >= pageCount || query.isPending}
              onClick={() => change("page", String(currentPage + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </GlassCard>
      <div className="list-footnote">
        
      </div>
    </>
  );
}

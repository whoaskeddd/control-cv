import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Copy, MapPin, Radio } from "lucide-react";
import { useSource } from "../hooks/useSources";
import {
  ErrorState,
  GlassCard,
  LoadingSkeleton,
  PageHeader,
  SectionHeader,
  StatusBadge,
} from "../components/ui/primitives";
import { SourceActions } from "../features/sources/SourceActions";
import { formatDate, safeUrl } from "../utils/format";
import { useToast } from "../components/ui/Toast";

export function SourceDetailPage() {
  const { id } = useParams();
  const query = useSource(Number(id));
  const toast = useToast();
  if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0)
    return (
      <ErrorState error={new Error("Некорректный идентификатор источника.")} />
    );
  if (query.isPending) return <LoadingSkeleton />;
  if (query.isError)
    return (
      <ErrorState
        error={query.error}
        retry={() => {
          void query.refetch();
        }}
      />
    );
  const source = query.data;
  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(source.url);
      toast("URL скопирован");
    } catch {
      toast("Не удалось скопировать. Выделите адрес вручную.", "error");
    }
  }
  return (
    <>
      <Link to="/sources" className="back-link">
        <ArrowLeft size={16} />
        Все источники
      </Link>
      <PageHeader
        eyebrow={`ИСТОЧНИК / CAM–${String(source.id).padStart(3, "0")}`}
        title={source.name}
        description="Параметры подключения и управление источником."
        action={<StatusBadge enabled={source.enabled} />}
      />
      <div className="detail-grid">
        <GlassCard className="details-card">
          <SectionHeader
            title="Основная информация"
            detail={`ID: ${source.id}`}
          />
          <dl className="detail-list">
            <div>
              <dt>Название</dt>
              <dd>{source.name}</dd>
            </div>
            <div>
              <dt>Локация</dt>
              <dd className="flex items-center gap-2">
                <MapPin size={17} />
                {source.location}
              </dd>
            </div>
            <div>
              <dt>URL видеопотока</dt>
              <dd className="url-detail">
                <code>{safeUrl(source.url)}</code>
                <button
                  className="icon-button"
                  aria-label="Скопировать URL"
                  title="Скопировать полный URL"
                  onClick={() => void copyUrl()}
                >
                  <Copy size={17} />
                </button>
              </dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>
                <StatusBadge enabled={source.enabled} />
              </dd>
            </div>
          </dl>
        </GlassCard>
        <GlassCard className="source-control">
          <div className="camera-emblem">
            <Camera size={38} strokeWidth={1.2} />
          </div>
          <h2>Управление источником</h2>
          <p>Измените параметры или состояние камеры в системе.</p>
          <SourceActions source={source} expanded />
        </GlassCard>
        <GlassCard className="details-card">
          <SectionHeader title="Сведения о записи" />
          <dl className="metadata-grid">
            <div>
              <dt>Создан</dt>
              <dd>{formatDate(source.created_at)}</dd>
            </div>
            <div>
              <dt>Последнее изменение</dt>
              <dd>{formatDate(source.updated_at)}</dd>
            </div>
          </dl>
        </GlassCard>
        <div className="detail-note">
          <Radio size={23} />
        
          <p>
            Просмотр видео и проверка доступности RTSP-потока не предусмотрены.
          </p>
        </div>
      </div>

    </>
  );
}

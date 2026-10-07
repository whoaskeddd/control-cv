import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SourceForm } from "../features/sources/SourceForm";
import { useSource } from "../hooks/useSources";
import {
  ErrorState,
  LoadingSkeleton,
  PageHeader,
} from "../components/ui/primitives";

export function SourceFormPage({ edit = false }: { edit?: boolean }) {
  const { id } = useParams();
  const query = useSource(edit ? Number(id) : NaN);
  if (edit && (!Number.isSafeInteger(Number(id)) || Number(id) <= 0))
    return (
      <ErrorState error={new Error("Некорректный идентификатор источника.")} />
    );
  if (edit && query.isPending) return <LoadingSkeleton />;
  if (edit && query.isError)
    return (
      <ErrorState
        error={query.error}
        retry={() => {
          void query.refetch();
        }}
      />
    );
  return (
    <>
      <Link className="back-link" to={edit ? `/sources/${id}` : "/sources"}>
        <ArrowLeft size={16} />
        {edit ? "К карточке источника" : "Все источники"}
      </Link>
      <PageHeader
        eyebrow={edit ? "ПАРАМЕТРЫ ИСТОЧНИКА" : "НОВОЕ ПОДКЛЮЧЕНИЕ"}
        title={edit ? "Редактировать источник" : "Добавить источник"}
        description={
          edit
            ? "Обновите данные камеры. Изменения вступят в силу после сохранения."
            : "Подключите новую камеру к рабочему пространству."
        }
      />
      <SourceForm
        key={edit ? id : "new"}
        source={edit ? query.data : undefined}
      />
    </>
  );
}

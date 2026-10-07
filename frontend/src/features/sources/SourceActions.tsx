import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Power, Trash2 } from "lucide-react";
import type { Source } from "../../types/source";
import { useSourceMutations } from "../../hooks/useSources";
import { useToast } from "../../components/ui/Toast";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";

export function SourceActions({
  source,
  expanded = false,
}: {
  source: Source;
  expanded?: boolean;
}) {
  const [confirm, setConfirm] = useState(false);
  const { update, remove } = useSourceMutations();
  const toast = useToast();
  const navigate = useNavigate();
  const pending = update.isPending || remove.isPending;
  const toggle = () =>
    update.mutate(
      { id: source.id, body: { enabled: !source.enabled } },
      {
        onSuccess: () =>
          toast(source.enabled ? "Источник выключен" : "Источник включён"),
        onError: (error) => toast(error.message, "error"),
      },
    );
  const deleteSource = () =>
    remove.mutate(source.id, {
      onSuccess: () => {
        setConfirm(false);
        toast("Источник удалён");
        if (expanded) navigate("/sources");
      },
    });
  return (
    <>
      <div className={expanded ? "detail-actions" : "row-actions"}>
        <Link
          className={expanded ? "button secondary" : "icon-button"}
          to={`/sources/${source.id}/edit`}
          aria-label={`Редактировать ${source.name}`}
          title="Редактировать"
        >
          <Pencil size={16} />
          {expanded && "Редактировать"}
        </Link>
        <button
          className={expanded ? "button secondary" : "icon-button"}
          disabled={pending}
          onClick={toggle}
          title={source.enabled ? "Выключить" : "Включить"}
          aria-label={`${source.enabled ? "Выключить" : "Включить"} ${source.name}`}
        >
          <Power size={16} />
          {expanded &&
            (update.isPending
              ? "Сохранение…"
              : source.enabled
                ? "Выключить"
                : "Включить")}
        </button>
        <button
          className={
            expanded ? "button danger-outline" : "icon-button delete-action"
          }
          disabled={pending}
          onClick={() => {
            remove.reset();
            setConfirm(true);
          }}
          title="Удалить"
          aria-label={`Удалить ${source.name}`}
        >
          <Trash2 size={16} />
          {expanded && "Удалить"}
        </button>
      </div>
      <ConfirmDialog
        open={confirm}
        name={source.name}
        pending={remove.isPending}
        error={remove.error?.message}
        onClose={() => setConfirm(false)}
        onConfirm={deleteSource}
      />
    </>
  );
}

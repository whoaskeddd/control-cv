import { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";

export function ConfirmDialog({
  open,
  name,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  name: string;
  pending: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    if (open && !node?.open) node?.showModal();
    else if (!open && node?.open) node.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      aria-labelledby="delete-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current && !pending) onClose();
      }}
    >
      <div className="dialog-content">
        <div className="flex items-center justify-between">
          <span className="danger-icon">
            <Trash2 size={23} />
          </span>
          <button
            className="icon-button"
            disabled={pending}
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="delete-title">Удалить источник?</h2>
        <p>
          «{name}» будет удалён из системы. Отменить это действие не получится.
        </p>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button
            className="button secondary"
            autoFocus
            disabled={pending}
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="button danger"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Удаление…" : "Удалить источник"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

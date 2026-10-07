import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  kind: "success" | "error";
}
const ToastContext = createContext<
  (message: string, kind?: Toast["kind"]) => void
>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const sequence = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const dismiss = (id: number) =>
    setToasts((items) => items.filter((item) => item.id !== id));
  const notify = useCallback(
    (message: string, kind: Toast["kind"] = "success") => {
      const id = ++sequence.current;
      setToasts((items) => [...items.slice(-3), { id, message, kind }]);
      timers.current.push(
        setTimeout(() => dismiss(id), kind === "error" ? 8000 : 5000),
      );
    },
    [],
  );
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-stack" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className={`toast ${toast.kind}`}
              role={toast.kind === "error" ? "alert" : "status"}
            >
              {toast.kind === "success" ? (
                <CheckCircle2 size={19} />
              ) : (
                <CircleAlert size={19} />
              )}
              <span>{toast.message}</span>
              <button
                className="icon-button"
                aria-label="Закрыть уведомление"
                onClick={() => dismiss(toast.id)}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

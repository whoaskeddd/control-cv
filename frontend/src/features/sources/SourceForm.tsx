import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Check, Info, Save } from "lucide-react";
import { useSourceMutations } from "../../hooks/useSources";
import { ApiError } from "../../api/client";
import { FormField } from "../../components/ui/FormField";
import { GlassCard, SectionHeader } from "../../components/ui/primitives";
import { useToast } from "../../components/ui/Toast";
import type { Source, SourceInput } from "../../types/source";

const requiredText = z
  .string()
  .trim()
  .min(1, "Заполните поле.")
  .max(255, "Не больше 255 символов.");
const schema = z.object({
  name: requiredText,
  location: requiredText,
  url: requiredText.refine((value) => {
    try {
      const url = new URL(value);
      return (
        ["rtsp:", "http:", "https:"].includes(url.protocol) &&
        Boolean(url.hostname) &&
        !/\s/.test(value)
      );
    } catch {
      return false;
    }
  }, "Укажите адрес с хостом и протоколом rtsp://, http:// или https://."),
  enabled: z.boolean(),
});

export function SourceForm({ source }: { source?: Source }) {
  const { create, update } = useSourceMutations();
  const toast = useToast();
  const navigate = useNavigate();
  const form = useForm<SourceInput>({
    resolver: zodResolver(schema),
    defaultValues: source
      ? {
          name: source.name,
          url: source.url,
          location: source.location,
          enabled: source.enabled,
        }
      : { name: "", url: "", location: "", enabled: true },
  });
  const pending = create.isPending || update.isPending;
  const enabled = form.watch("enabled");
  const back = source ? `/sources/${source.id}` : "/sources";
  async function submit(values: SourceInput) {
    form.clearErrors("root");
    try {
      const saved = source
        ? await update.mutateAsync({ id: source.id, body: values })
        : await create.mutateAsync(values);
      toast(source ? "Изменения сохранены" : "Источник добавлен");
      navigate(`/sources/${saved.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const field of ["name", "url", "location", "enabled"] as const) {
          if (error.fields[field])
            form.setError(field, { message: error.fields[field] });
        }
      }
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Не удалось сохранить источник.",
      });
    }
  }
  return (
    <div className="form-layout">
      <GlassCard className="form-card">
        <SectionHeader
          title={source ? "Параметры источника" : "Новый источник"}
          detail="Обязательные поля отмечены *"
        />
        <form onSubmit={form.handleSubmit(submit)} noValidate>
          <fieldset disabled={pending}>
            <FormField
              label="Название"
              placeholder="Например, Конвейер №1"
              autoFocus
              maxLength={255}
              hint="Понятное название, по которому легко найти камеру."
              error={form.formState.errors.name?.message}
              registration={form.register("name")}
            />
            <FormField
              label="URL видеопотока"
              placeholder="rtsp://192.168.1.21/stream"
              maxLength={255}
              autoCapitalize="none"
              spellCheck={false}
              hint="Поддерживаются адреса RTSP, HTTP и HTTPS."
              error={form.formState.errors.url?.message}
              registration={form.register("url")}
            />
            <FormField
              label="Локация"
              placeholder="Например, Цех 3"
              maxLength={255}
              hint="Цех, помещение или участок, где находится камера."
              error={form.formState.errors.location?.message}
              registration={form.register("location")}
            />
            <div className="form-status">
              <div>
                <label htmlFor="enabled">Состояние источника</label>
                <p>
                  {enabled
                    ? "Источник будет включён в системе"
                    : "Источник будет выключен в системе"}
                </p>
              </div>
              <label className="switch">
                <input
                  id="enabled"
                  type="checkbox"
                  {...form.register("enabled")}
                />
                <span className="switch-track">
                  <span className="switch-thumb">
                    {enabled && <Check size={10} />}
                  </span>
                </span>
              </label>
            </div>
          </fieldset>
          {form.formState.errors.root && (
            <div className="form-error" role="alert">
              <Info size={18} />
              {form.formState.errors.root.message}
            </div>
          )}
          <div className="form-actions">
            <Link
              className={`button secondary ${pending ? "disabled-link" : ""}`}
              aria-disabled={pending}
              tabIndex={pending ? -1 : 0}
              to={back}
            >
              Отмена
            </Link>
            <button className="button primary" disabled={pending} type="submit">
              <Save size={16} />
              {pending ? "Сохранение…" : "Сохранить источник"}
            </button>
          </div>
        </form>
      </GlassCard>
      
    </div>
  );
}

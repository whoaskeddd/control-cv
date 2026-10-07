import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export function FormField({
  label,
  hint,
  error,
  registration,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  const id = registration.name;
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        <span aria-hidden="true"> *</span>
      </label>
      <input
        id={id}
        {...props}
        {...registration}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-help`}
      />
      <span id={`${id}-help`} className={error ? "field-error" : "field-hint"}>
        {error || hint}
      </span>
    </div>
  );
}

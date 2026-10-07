import type { ReactNode } from "react";

export function DataTable({
  headings,
  children,
}: {
  headings: { key: string; label: ReactNode }[];
  children: ReactNode;
}) {
  return (
    <div
      className="table-scroll"
      tabIndex={0}
      role="region"
      aria-label="Таблица источников видео"
    >
      <table>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading.key} scope="col">
                {heading.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

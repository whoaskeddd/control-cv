import { request } from "./client";
import type { Source, SourceInput } from "../types/source";

export const sourcesApi = {
  list: (search = "", signal?: AbortSignal) =>
    request<Source[]>(
      `/sources${search ? `?${new URLSearchParams({ search })}` : ""}`,
      { signal },
    ),
  get: (id: number, signal?: AbortSignal) =>
    request<Source>(`/sources/${id}`, { signal }),
  create: (body: SourceInput) =>
    request<Source>("/sources", { method: "POST", body: JSON.stringify(body) }),
  update: (id: number, body: Partial<SourceInput>) =>
    request<Source>(`/sources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: number) => request<void>(`/sources/${id}`, { method: "DELETE" }),
};

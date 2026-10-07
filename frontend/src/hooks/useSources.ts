import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sourcesApi } from "../api/sources";
import type { SourceInput } from "../types/source";

export const sourceKeys = {
  all: ["sources"] as const,
  list: (search: string) => ["sources", "list", search] as const,
  detail: (id: number) => ["sources", "detail", id] as const,
};

export function useSources(search = "") {
  return useQuery({
    queryKey: sourceKeys.list(search),
    queryFn: ({ signal }) => sourcesApi.list(search, signal),
  });
}

export function useSource(id: number) {
  return useQuery({
    queryKey: sourceKeys.detail(id),
    queryFn: ({ signal }) => sourcesApi.get(id, signal),
    enabled: Number.isSafeInteger(id) && id > 0,
  });
}

export function useSourceMutations() {
  const client = useQueryClient();
  const refresh = () => {
    void client.invalidateQueries({ queryKey: sourceKeys.all });
  };
  const create = useMutation({
    mutationFn: sourcesApi.create,
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<SourceInput> }) =>
      sourcesApi.update(id, body),
    onSuccess: (source) => {
      client.setQueryData(sourceKeys.detail(source.id), source);
      refresh();
    },
  });
  const remove = useMutation({
    mutationFn: sourcesApi.remove,
    onSuccess: (_data, id) => {
      client.removeQueries({ queryKey: sourceKeys.detail(id) });
      refresh();
    },
  });
  return { create, update, remove };
}

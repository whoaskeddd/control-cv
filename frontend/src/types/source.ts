export interface Source {
  id: number;
  name: string;
  url: string;
  location: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type SourceInput = Pick<Source, "name" | "url" | "location" | "enabled">;

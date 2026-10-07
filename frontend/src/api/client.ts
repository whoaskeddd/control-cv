const baseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: options.signal ?? AbortSignal.timeout(15000),
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError(
      "Нет соединения с сервером. Проверьте подключение и повторите запрос.",
      0,
    );
  }
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const fields: Record<string, string> = {};
    if (isRecord(body) && Array.isArray(body.detail)) {
      for (const item of body.detail) {
        if (isRecord(item) && Array.isArray(item.loc)) {
          const field = item.loc.at(-1);
          if (typeof field === "string")
            fields[field] = "Проверьте значение поля.";
        }
      }
    }
    const message =
      response.status === 404
        ? "Источник не найден. Возможно, он был удалён."
        : response.status === 422
          ? "Проверьте введённые данные."
          : "Не удалось выполнить запрос. Повторите попытку.";
    throw new ApiError(message, response.status, fields);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

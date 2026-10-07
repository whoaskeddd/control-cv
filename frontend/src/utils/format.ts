export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function safeUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.username || url.password) {
      url.username = "•••";
      url.password = "•••";
    }
    return decodeURI(url.toString());
  } catch {
    return value;
  }
}

export function serializeParams(params: Record<string, any>): string {
  const query = [];

  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((v) => query.push(`${key}=${encodeURIComponent(v)}`));
    } else if (value !== undefined && value !== null) {
      query.push(`${key}=${encodeURIComponent(value)}`);
    }
  }

  return query.join("&");
}

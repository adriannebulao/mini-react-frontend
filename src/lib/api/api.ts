const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function request<TResponse>(
  url: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(`Request failed: ${res.status} ${message}`)
  }

  return res.json()
}
